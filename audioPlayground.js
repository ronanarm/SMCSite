// Audio Context and nodes
let audioContext;
let audioSource;
let audioBuffer;
let gainNode;
let analyser;

// EQ nodes
let lowCutFilter;
let lowEQFilter;
let lowMidEQFilter;
let highMidEQFilter;
let highEQFilter;
let eqInputNode;
let eqOutputNode;

// Compressor node
let compressor;
let compressorInputNode;
let compressorOutputNode;

// Gate implementation
let gateNode;
let gateGain;
let gateAnalyser;
let gateInputNode;
let gateOutputNode;
let lastGateTime = 0;
let lastAboveThresholdTime = 0;
let isGateOpen = false;
let currentGateState = 'closed'; // possible states: 'closed', 'attacking', 'open', 'holding', 'releasing'
let releaseStartGain = 0;
let releaseStartTime = 0;

// Playback state
let isPlaying = false;
let isPaused = false;
let startTime = 0;
let pauseTime = 0;

// Initialize the audio context when the page loads
document.addEventListener('DOMContentLoaded', initAudio);

function initAudio() {
    // Set up event listeners for file input and controls
    document.getElementById('audioFileInput').addEventListener('change', handleFileUpload);
    document.getElementById('playButton').addEventListener('click', playAudio);
    document.getElementById('pauseButton').addEventListener('click', pauseAudio);
    document.getElementById('stopButton').addEventListener('click', stopAudio);
    document.getElementById('restartButton').addEventListener('click', restartAudio);
    document.getElementById('volumeSlider').addEventListener('input', updateVolume);

    // Set up EQ controls
    document.getElementById('lowCutEQ').addEventListener('input', updateEQ);
    document.getElementById('lowEQ').addEventListener('input', updateEQ);
    document.getElementById('lowEQFreq').addEventListener('input', updateEQ);
    document.getElementById('lowMidEQ').addEventListener('input', updateEQ);
    document.getElementById('lowMidEQFreq').addEventListener('input', updateEQ);
    document.getElementById('highMidEQ').addEventListener('input', updateEQ);
    document.getElementById('highMidEQFreq').addEventListener('input', updateEQ);
    document.getElementById('highEQ').addEventListener('input', updateEQ);
    document.getElementById('highEQFreq').addEventListener('input', updateEQ);

    // Set up compressor controls
    document.getElementById('threshold').addEventListener('input', updateCompressor);
    document.getElementById('ratio').addEventListener('input', updateCompressor);
    document.getElementById('attack').addEventListener('input', updateCompressor);
    document.getElementById('release').addEventListener('input', updateCompressor);

    // Set up gate controls
    document.getElementById('gateThreshold').addEventListener('input', updateGate);
    document.getElementById('gateAttack').addEventListener('input', updateGate);
    document.getElementById('gateHold').addEventListener('input', updateGate);
    document.getElementById('gateRelease').addEventListener('input', updateGate);

    // Set up bypass controls
    document.getElementById('eqBypass').addEventListener('change', updateBypass);
    document.getElementById('compressorBypass').addEventListener('change', updateBypass);
    document.getElementById('gateBypass').addEventListener('change', updateBypass);

    // Initialize UI values
    updateUIValues();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Display file info
    const audioInfo = document.getElementById('audioInfo');
    audioInfo.textContent = `File: ${file.name} (${formatFileSize(file.size)})`;

    // Create or reset AudioContext (to handle browser autoplay policy)
    if (audioContext) {
        audioContext.close();
    }
    
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    setupAudioNodes();

    // Read and decode the audio file
    const reader = new FileReader();
    reader.onload = function(e) {
        const audioData = e.target.result;
        audioContext.decodeAudioData(audioData)
            .then(buffer => {
                audioBuffer = buffer;
                audioInfo.textContent += ` | Duration: ${formatTime(buffer.duration)}`;
                enablePlaybackControls(true);
            })
            .catch(error => {
                console.error('Error decoding audio data', error);
                audioInfo.textContent = 'Error loading audio file. Please try another file.';
            });
    };
    reader.readAsArrayBuffer(file);
}

function setupAudioNodes() {
    // Create main gain node for volume control
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5; // 50% volume

    // Create analyser for visualization (if needed later)
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    // Create bypass nodes for each module
    eqInputNode = audioContext.createGain();
    eqOutputNode = audioContext.createGain();
    compressorInputNode = audioContext.createGain();
    compressorOutputNode = audioContext.createGain();
    gateInputNode = audioContext.createGain();
    gateOutputNode = audioContext.createGain();

    // Create EQ filters
    lowCutFilter = audioContext.createBiquadFilter();
    lowCutFilter.type = 'highpass';
    lowCutFilter.frequency.value = 1;
    lowCutFilter.Q.value = 0.7;

    lowEQFilter = audioContext.createBiquadFilter();
    lowEQFilter.type = 'lowshelf';
    lowEQFilter.frequency.value = 100;
    lowEQFilter.gain.value = 0;

    lowMidEQFilter = audioContext.createBiquadFilter();
    lowMidEQFilter.type = 'peaking';
    lowMidEQFilter.frequency.value = 1000;
    lowMidEQFilter.Q.value = 1;
    lowMidEQFilter.gain.value = 0;

    highMidEQFilter = audioContext.createBiquadFilter();
    highMidEQFilter.type = 'peaking';
    highMidEQFilter.frequency.value = 3000;
    highMidEQFilter.Q.value = 1;
    highMidEQFilter.gain.value = 0;

    highEQFilter = audioContext.createBiquadFilter();
    highEQFilter.type = 'highshelf';
    highEQFilter.frequency.value = 10000;
    highEQFilter.gain.value = 0;

    // Create compressor
    compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.05;
    compressor.release.value = 0.25;
    compressor.knee.value = 5;

    // Create gate components
    gateGain = audioContext.createGain();
    gateGain.gain.value = 1.0;

    gateAnalyser = audioContext.createAnalyser();
    gateAnalyser.fftSize = 1024;
    gateAnalyser.smoothingTimeConstant = 0.3;

    // Connect the EQ chain
    lowCutFilter.connect(lowEQFilter);
    lowEQFilter.connect(lowMidEQFilter);
    lowMidEQFilter.connect(highMidEQFilter);
    highMidEQFilter.connect(highEQFilter);
    highEQFilter.connect(eqOutputNode);

    // Connect the compressor chain
    compressor.connect(compressorOutputNode);

    // Connect the gate chain
    gateAnalyser.connect(gateGain);
    gateGain.connect(gateOutputNode);

    // Update routing based on current bypass states
    updateBypass();
}

function playAudio() {
    if (!audioContext || !audioBuffer) return;

    // Resume audio context if it's suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    if (isPlaying) {
        // Already playing, do nothing
        return;
    }

    // Create a new source node (they can only be used once)
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(eqInputNode);

    if (isPaused) {
        // Resume from pause position
        startTime = audioContext.currentTime - pauseTime;
        audioSource.start(0, pauseTime);
        isPaused = false;
    } else {
        // Start from beginning
        startTime = audioContext.currentTime;
        audioSource.start();
    }

    isPlaying = true;
    updatePlaybackButtonStates();
}

function pauseAudio() {
    if (!isPlaying || !audioSource) return;

    // Calculate current position
    pauseTime = audioContext.currentTime - startTime;
    
    // Stop the current source
    audioSource.stop();
    audioSource = null;
    
    isPlaying = false;
    isPaused = true;
    updatePlaybackButtonStates();
}

function stopAudio() {
    if (!audioSource) return;

    audioSource.stop();
    audioSource = null;
    
    isPlaying = false;
    isPaused = false;
    pauseTime = 0;
    updatePlaybackButtonStates();
}

function restartAudio() {
    if (audioSource) {
        audioSource.stop();
        audioSource = null;
    }
    
    isPlaying = false;
    isPaused = false;
    pauseTime = 0;
    
    // Start playing from the beginning
    playAudio();
}

function updateVolume() {
    if (!gainNode) return;
    
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    
    const volume = volumeSlider.value / 100;
    gainNode.gain.value = volume;
    volumeValue.textContent = `${volumeSlider.value}%`;
}

function updateEQ(event) {
    if (!audioContext) return;

    // Get the slider that triggered the event
    const slider = event ? event.target : null;
    
    // Update low cut filter
    const lowCutFreq = parseFloat(document.getElementById('lowCutEQ').value);
    lowCutFilter.frequency.value = lowCutFreq;
    document.getElementById('lowCutEQFreqValue').textContent = `${lowCutFreq} Hz`;

    // Update low EQ
    const lowGain = parseFloat(document.getElementById('lowEQ').value);
    const lowFreq = parseFloat(document.getElementById('lowEQFreq').value);
    lowEQFilter.gain.value = lowGain;
    lowEQFilter.frequency.value = lowFreq;
    document.getElementById('lowEQValue').textContent = `${lowGain} dB`;
    document.getElementById('lowEQFreqValue').textContent = `${lowFreq} Hz`;

    // Update low-mid EQ
    const lowMidGain = parseFloat(document.getElementById('lowMidEQ').value);
    const lowMidFreq = parseFloat(document.getElementById('lowMidEQFreq').value);
    lowMidEQFilter.gain.value = lowMidGain;
    lowMidEQFilter.frequency.value = lowMidFreq;
    document.getElementById('lowMidEQValue').textContent = `${lowMidGain} dB`;
    document.getElementById('lowMidEQFreqValue').textContent = `${lowMidFreq} Hz`;

    // Update high-mid EQ
    const highMidGain = parseFloat(document.getElementById('highMidEQ').value);
    const highMidFreq = parseFloat(document.getElementById('highMidEQFreq').value);
    highMidEQFilter.gain.value = highMidGain;
    highMidEQFilter.frequency.value = highMidFreq;
    document.getElementById('highMidEQValue').textContent = `${highMidGain} dB`;
    document.getElementById('highMidEQFreqValue').textContent = `${highMidFreq} Hz`;

    // Update high EQ
    const highGain = parseFloat(document.getElementById('highEQ').value);
    const highFreq = parseFloat(document.getElementById('highEQFreq').value);
    highEQFilter.gain.value = highGain;
    highEQFilter.frequency.value = highFreq;
    document.getElementById('highEQValue').textContent = `${highGain} dB`;
    document.getElementById('highEQFreqValue').textContent = `${highFreq} Hz`;
}

function updateCompressor(event) {
    if (!compressor) return;

    // Get values from sliders
    const threshold = parseFloat(document.getElementById('threshold').value);
    const ratio = parseFloat(document.getElementById('ratio').value);
    const attack = parseFloat(document.getElementById('attack').value) / 1000; // Convert to seconds
    const release = parseFloat(document.getElementById('release').value) / 1000; // Convert to seconds

    // Update compressor parameters
    compressor.threshold.value = threshold;
    compressor.ratio.value = ratio;
    compressor.attack.value = attack;
    compressor.release.value = release;

    // Update UI display
    document.getElementById('thresholdValue').textContent = `${threshold} dB`;
    document.getElementById('ratioValue').textContent = `${ratio}:1`;
    document.getElementById('attackValue').textContent = `${document.getElementById('attack').value} ms`;
    document.getElementById('releaseValue').textContent = `${document.getElementById('release').value} ms`;
}

function updateGate(event) {
    const gateThreshold = document.getElementById('gateThreshold').value;
    const gateAttack = document.getElementById('gateAttack').value;
    const gateHold = document.getElementById('gateHold').value;
    const gateRelease = document.getElementById('gateRelease').value;
    
    // Update display values
    document.getElementById('gateThresholdValue').textContent = `${gateThreshold} dB`;
    document.getElementById('gateAttackValue').textContent = `${gateAttack} ms`;
    document.getElementById('gateHoldValue').textContent = `${gateHold} ms`;
    document.getElementById('gateReleaseValue').textContent = `${gateRelease} ms`;
}

function processGate() {
    if (!audioContext || !gateAnalyser || !gateGain) {
        requestAnimationFrame(processGate);
        return;
    }

    const bufferLength = gateAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    gateAnalyser.getByteTimeDomainData(dataArray);

    // Calculate RMS (root mean square) to get signal level
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
        const amplitude = (dataArray[i] - 128) / 128;
        sum += amplitude * amplitude;
    }
    const rms = Math.sqrt(sum / bufferLength);
    
    // Convert to dB
    const db = 20 * Math.log10(rms);
    
    // Get gate parameters
    const threshold = parseFloat(document.getElementById('gateThreshold').value);
    const attackTime = parseFloat(document.getElementById('gateAttack').value) / 1000;
    const holdTime = parseFloat(document.getElementById('gateHold').value) / 1000;
    const releaseTime = parseFloat(document.getElementById('gateRelease').value) / 1000;
    
    const now = audioContext.currentTime;
    const timeDelta = now - lastGateTime;
    lastGateTime = now;

    // Signal is above threshold
    if (db >= threshold) {
        lastAboveThresholdTime = now;
        
        if (currentGateState === 'closed' || currentGateState === 'releasing') {
            // Start attack phase
            currentGateState = 'attacking';
            releaseStartTime = 0;
        }
        
        if (currentGateState === 'attacking') {
            // Calculate attack ramp
            const currentGain = gateGain.gain.value;
            const attackGain = Math.min(1, currentGain + (timeDelta / attackTime));
            gateGain.gain.setTargetAtTime(attackGain, now, attackTime / 3);
            
            if (attackGain >= 0.99) {
                currentGateState = 'open';
            }
        }
    }
    // Signal is below threshold
    else {
        const timeSinceAboveThreshold = now - lastAboveThresholdTime;
        
        // Check if we should still be holding
        if (timeSinceAboveThreshold <= holdTime) {
            if (currentGateState !== 'holding') {
                currentGateState = 'holding';
            }
            // Maintain current gain during hold
            gateGain.gain.setValueAtTime(gateGain.gain.value, now);
        }
        // Start release phase after hold time
        else {
            if (currentGateState !== 'releasing') {
                currentGateState = 'releasing';
                releaseStartTime = now;
                releaseStartGain = gateGain.gain.value;
            }
            
            if (currentGateState === 'releasing') {
                const releaseProgress = (now - releaseStartTime) / releaseTime;
                if (releaseProgress >= 1) {
                    // Fully closed
                    gateGain.gain.setTargetAtTime(0, now, 0.01);
                    currentGateState = 'closed';
                } else {
                    // Smooth exponential release
                    const releaseGain = releaseStartGain * Math.pow(0.01, releaseProgress);
                    gateGain.gain.setTargetAtTime(releaseGain, now, releaseTime / 3);
                }
            }
        }
    }
    
    // Continue processing
    requestAnimationFrame(processGate);
}

function updateBypass() {
    if (!audioContext) return;

    // Disconnect all nodes first
    try {
        eqInputNode.disconnect();
        eqOutputNode.disconnect();
        compressorInputNode.disconnect();
        compressorOutputNode.disconnect();
        gateInputNode.disconnect();
        gateOutputNode.disconnect();
        lowCutFilter.disconnect();
        lowEQFilter.disconnect();
        lowMidEQFilter.disconnect();
        highMidEQFilter.disconnect();
        highEQFilter.disconnect();
        compressor.disconnect();
        gateAnalyser.disconnect();
        gateGain.disconnect();
    } catch (e) {
        // Ignore disconnection errors
    }

    // Get bypass states
    const eqEnabled = document.getElementById('eqBypass').checked;
    const compressorEnabled = document.getElementById('compressorBypass').checked;
    const gateEnabled = document.getElementById('gateBypass').checked;

    let currentOutput = eqInputNode;

    // EQ Section
    if (eqEnabled) {
        currentOutput.connect(lowCutFilter);
        // Connect the EQ chain
        lowCutFilter.connect(lowEQFilter);
        lowEQFilter.connect(lowMidEQFilter);
        lowMidEQFilter.connect(highMidEQFilter);
        highMidEQFilter.connect(highEQFilter);
        highEQFilter.connect(eqOutputNode);
        currentOutput = eqOutputNode;
    }

    // Compressor Section
    currentOutput.connect(compressorInputNode);
    if (compressorEnabled) {
        compressorInputNode.connect(compressor);
        compressor.connect(compressorOutputNode);
        currentOutput = compressorOutputNode;
    } else {
        compressorInputNode.connect(compressorOutputNode);
        currentOutput = compressorOutputNode;
    }

    // Gate Section
    currentOutput.connect(gateInputNode);
    if (gateEnabled) {
        gateInputNode.connect(gateAnalyser);
        gateAnalyser.connect(gateGain);
        gateGain.connect(gateOutputNode);
        currentOutput = gateOutputNode;
    } else {
        gateInputNode.connect(gateOutputNode);
        currentOutput = gateOutputNode;
    }

    // Connect to final output
    currentOutput.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(audioContext.destination);

    // Restart gate processing if it's enabled
    if (gateEnabled) {
        processGate();
    }
}

function updateUIValues() {
    // Initialize display values
    updateVolume();
    updateEQ();
    updateCompressor();
    updateGate();
}

function updatePlaybackButtonStates() {
    const playButton = document.getElementById('playButton');
    const pauseButton = document.getElementById('pauseButton');
    const stopButton = document.getElementById('stopButton');
    const restartButton = document.getElementById('restartButton');
    
    playButton.disabled = isPlaying;
    pauseButton.disabled = !isPlaying;
    stopButton.disabled = !isPlaying && !isPaused;
    restartButton.disabled = !audioBuffer;
}

function enablePlaybackControls(enabled) {
    const buttons = [
        document.getElementById('playButton'),
        document.getElementById('pauseButton'),
        document.getElementById('stopButton'),
        document.getElementById('restartButton')
    ];
    
    buttons.forEach(button => {
        button.disabled = !enabled;
    });
    
    // Set initial states
    if (enabled) {
        document.getElementById('playButton').disabled = false;
        document.getElementById('pauseButton').disabled = true;
        document.getElementById('stopButton').disabled = true;
        document.getElementById('restartButton').disabled = false;
    }
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}