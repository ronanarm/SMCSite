class AudioTrack {
    constructor(context, masterBus) {
        this.context = context;
        this.masterBus = masterBus;
        this.buffer = null;
        this.source = null;
        this.isPlaying = false;
        this.startTime = 0;
        this.pauseTime = 0;
        
        // Create audio nodes
        this.gainNode = context.createGain();
        this.panNode = context.createStereoPanner();
        this.analyser = context.createAnalyser();
        
        // Compressor node
        this.compressor = context.createDynamicsCompressor();
        this.compressor.threshold.value = -24;
        this.compressor.knee.value = 30;
        this.compressor.ratio.value = 12;
        this.compressor.attack.value = 0.003;
        this.compressor.release.value = 0.25;
        this.compressorEnabled = false;

        // Gate nodes
        this.gateGain = context.createGain();
        this.gateAnalyser = context.createAnalyser();
        this.gateAnalyser.fftSize = 1024;
        this.gateAnalyser.smoothingTimeConstant = 0.3;
        this.gateEnabled = false;
        
        // Gate state
        this.lastGateTime = 0;
        this.lastAboveThresholdTime = 0;
        this.currentGateState = 'closed'; // possible states: 'closed', 'attacking', 'open', 'holding', 'releasing'
        this.releaseStartGain = 0;
        this.releaseStartTime = 0;
        
        // Gate parameters
        this.gateParams = {
            threshold: -40,
            attack: 10,    // ms
            hold: 100,     // ms
            release: 100   // ms
        };
        
        // EQ nodes
        this.lowEQ = context.createBiquadFilter();
        this.midEQ = context.createBiquadFilter();
        this.highEQ = context.createBiquadFilter();
        
        // Set up EQ
        this.lowEQ.type = 'lowshelf';
        this.lowEQ.frequency.value = 320;
        this.midEQ.type = 'peaking';
        this.midEQ.frequency.value = 1000;
        this.midEQ.Q.value = 1;
        this.highEQ.type = 'highshelf';
        this.highEQ.frequency.value = 3200;
        
        // Connect nodes
        this.gainNode.connect(this.panNode);
        this.panNode.connect(this.compressor);
        this.compressor.connect(this.lowEQ);
        this.lowEQ.connect(this.midEQ);
        this.midEQ.connect(this.highEQ);
        this.highEQ.connect(this.analyser);
        this.analyser.connect(this.masterBus);
        
        // Default values
        this.gainNode.gain.value = 0.75;
        this.panNode.pan.value = 0;
        this.lowEQ.gain.value = 0;
        this.midEQ.gain.value = 0;
        this.highEQ.gain.value = 0;
        
        // Mute/Solo state
        this.muted = false;
        this.soloed = false;
    }

    async loadFile(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            this.buffer = await this.context.decodeAudioData(arrayBuffer);
            return true;
        } catch (error) {
            console.error('Error loading audio file:', error);
            return false;
        }
    }

    play(startTime = 0) {
        if (!this.buffer) return;
        if (this.isPlaying) this.stop();
        
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.gainNode);
        
        // Ensure startTime is within valid range
        startTime = Math.max(0, Math.min(startTime, this.buffer.duration));
        
        this.source.start(0, startTime);
        this.startTime = this.context.currentTime - startTime;
        this.isPlaying = true;
    }

    stop() {
        if (this.source) {
            try {
                this.source.stop();
                this.source.disconnect();
            } catch (e) {
                // Handle any errors during stop
            }
        }
        this.isPlaying = false;
        this.pauseTime = 0;
        this.startTime = 0;
    }

    pause() {
        if (this.isPlaying) {
            const currentTime = this.context.currentTime;
            const elapsedTime = currentTime - this.startTime;
            this.pauseTime = Math.max(0, elapsedTime);
            this.stop();
        }
    }

    setVolume(value) {
        const normalizedValue = Math.max(0, Math.min(1, value));
        this.gainNode.gain.value = normalizedValue;
    }

    setPan(value) {
        const normalizedValue = Math.max(-1, Math.min(1, value));
        this.panNode.pan.value = normalizedValue;
    }

    setEQ(type, value) {
        const gain = Math.max(-12, Math.min(12, value));
        switch(type) {
            case 'low':
                this.lowEQ.gain.value = gain;
                break;
            case 'mid':
                this.midEQ.gain.value = gain;
                break;
            case 'high':
                this.highEQ.gain.value = gain;
                break;
        }
    }

    getEQValues() {
        return {
            high: this.highEQ.gain.value,
            mid: this.midEQ.gain.value,
            low: this.lowEQ.gain.value
        };
    }

    setCompressorEnabled(enabled) {
        this.compressorEnabled = enabled;
        if (enabled) {
            this.panNode.disconnect();
            this.panNode.connect(this.compressor);
            this.compressor.connect(this.lowEQ);
        } else {
            this.panNode.disconnect();
            this.compressor.disconnect();
            this.panNode.connect(this.lowEQ);
        }
    }

    setCompressorParam(param, value) {
        switch(param) {
            case 'threshold':
                this.compressor.threshold.value = value;
                break;
            case 'knee':
                this.compressor.knee.value = value;
                break;
            case 'ratio':
                this.compressor.ratio.value = value;
                break;
            case 'attack':
                this.compressor.attack.value = value;
                break;
            case 'release':
                this.compressor.release.value = value;
                break;
        }
    }

    getCompressorValues() {
        return {
            enabled: this.compressorEnabled,
            threshold: this.compressor.threshold.value,
            knee: this.compressor.knee.value,
            ratio: this.compressor.ratio.value,
            attack: this.compressor.attack.value,
            release: this.compressor.release.value
        };
    }

    processGate() {
        if (!this.context || !this.gateAnalyser || !this.gateGain || !this.gateEnabled) {
            requestAnimationFrame(() => this.processGate());
            return;
        }

        const bufferLength = this.gateAnalyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.gateAnalyser.getByteTimeDomainData(dataArray);

        // Calculate RMS (root mean square) to get signal level
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            const amplitude = (dataArray[i] - 128) / 128;
            sum += amplitude * amplitude;
        }
        const rms = Math.sqrt(sum / bufferLength);
        
        // Convert to dB
        const db = 20 * Math.log10(rms);
        
        const now = this.context.currentTime;
        const timeDelta = now - this.lastGateTime;
        this.lastGateTime = now;

        // Signal is above threshold
        if (db >= this.gateParams.threshold) {
            this.lastAboveThresholdTime = now;
            
            if (this.currentGateState === 'closed' || this.currentGateState === 'releasing') {
                // Start attack phase
                this.currentGateState = 'attacking';
                this.releaseStartTime = 0;
            }
            
            if (this.currentGateState === 'attacking') {
                // Calculate attack ramp
                const currentGain = this.gateGain.gain.value;
                const attackTime = this.gateParams.attack / 1000;
                const attackGain = Math.min(1, currentGain + (timeDelta / attackTime));
                this.gateGain.gain.setTargetAtTime(attackGain, now, attackTime / 3);
                
                if (attackGain >= 0.99) {
                    this.currentGateState = 'open';
                }
            }
        }
        // Signal is below threshold
        else {
            const timeSinceAboveThreshold = now - this.lastAboveThresholdTime;
            const holdTime = this.gateParams.hold / 1000;
            
            // Check if we should still be holding
            if (timeSinceAboveThreshold <= holdTime) {
                if (this.currentGateState !== 'holding') {
                    this.currentGateState = 'holding';
                }
                // Maintain current gain during hold
                this.gateGain.gain.setValueAtTime(this.gateGain.gain.value, now);
            }
            // Start release phase after hold time
            else {
                if (this.currentGateState !== 'releasing') {
                    this.currentGateState = 'releasing';
                    this.releaseStartTime = now;
                    this.releaseStartGain = this.gateGain.gain.value;
                }
                
                if (this.currentGateState === 'releasing') {
                    const releaseTime = this.gateParams.release / 1000;
                    const releaseProgress = (now - this.releaseStartTime) / releaseTime;
                    if (releaseProgress >= 1) {
                        // Fully closed
                        this.gateGain.gain.setTargetAtTime(0, now, 0.01);
                        this.currentGateState = 'closed';
                    } else {
                        // Smooth exponential release
                        const releaseGain = this.releaseStartGain * Math.pow(0.01, releaseProgress);
                        this.gateGain.gain.setTargetAtTime(releaseGain, now, releaseTime / 3);
                    }
                }
            }
        }
        
        // Continue processing
        requestAnimationFrame(() => this.processGate());
    }

    setGateEnabled(enabled) {
        this.gateEnabled = enabled;
        if (enabled) {
            this.panNode.disconnect();
            this.panNode.connect(this.gateAnalyser);
            this.gateAnalyser.connect(this.gateGain);
            this.gateGain.connect(this.compressor);
            this.processGate();
        } else {
            this.panNode.disconnect();
            this.gateAnalyser.disconnect();
            this.gateGain.disconnect();
            this.panNode.connect(this.compressor);
        }
    }

    setGateParam(param, value) {
        if (param in this.gateParams) {
            this.gateParams[param] = value;
        }
    }

    getGateValues() {
        return {
            enabled: this.gateEnabled,
            ...this.gateParams
        };
    }

    toggleMute() {
        this.muted = !this.muted;
        this.updateVolume();
    }

    toggleSolo() {
        this.soloed = !this.soloed;
    }

    updateVolume() {
        const volume = this.muted ? 0 : 0.75;
        this.gainNode.gain.value = volume;
    }
}

class Mixer {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.tracks = [];
        this.masterGain = this.context.createGain();
        this.masterAnalyser = this.context.createAnalyser();
        
        // Connect master bus to destination
        this.masterGain.connect(this.masterAnalyser);
        this.masterAnalyser.connect(this.context.destination);
        
        this.masterGain.gain.value = 0.8;
        this.isPlaying = false;
        
        this.initUI();
        this.setupEventListeners();
        this.startMetering();
    }

    async exportMix() {
        if (this.tracks.length === 0) {
            alert('No tracks to export!');
            return;
        }

        // Stop any current playback
        if (this.isPlaying) {
            this.stopPlayback();
        }

        // Create an offline context for rendering
        const maxDuration = Math.max(...this.tracks.map(track => 
            track.buffer ? track.buffer.duration : 0
        ));
        
        if (maxDuration === 0) {
            alert('No audio content to export!');
            return;
        }

        const offlineCtx = new OfflineAudioContext(2, Math.ceil(maxDuration * this.context.sampleRate), this.context.sampleRate);
        
        // Create a master gain for the offline context
        const offlineMaster = offlineCtx.createGain();
        offlineMaster.gain.value = this.masterGain.gain.value;
        offlineMaster.connect(offlineCtx.destination);

        // Create and connect all tracks
        const offlineTracks = this.tracks.map(track => {
            if (!track.buffer || track.muted) return null;

            const source = offlineCtx.createBufferSource();
            source.buffer = track.buffer;

            const gain = offlineCtx.createGain();
            gain.gain.value = track.muted ? 0 : track.gainNode.gain.value;

            const pan = offlineCtx.createStereoPanner();
            pan.pan.value = track.panNode.pan.value;

            // Create and connect EQ filters
            const lowEQ = offlineCtx.createBiquadFilter();
            const midEQ = offlineCtx.createBiquadFilter();
            const highEQ = offlineCtx.createBiquadFilter();

            lowEQ.type = 'lowshelf';
            lowEQ.frequency.value = 320;
            lowEQ.gain.value = track.lowEQ.gain.value;

            midEQ.type = 'peaking';
            midEQ.frequency.value = 1000;
            midEQ.Q.value = 1;
            midEQ.gain.value = track.midEQ.gain.value;

            highEQ.type = 'highshelf';
            highEQ.frequency.value = 3200;
            highEQ.gain.value = track.highEQ.gain.value;

            // Create and configure compressor
            const compressor = offlineCtx.createDynamicsCompressor();
            if (track.compressorEnabled) {
                compressor.threshold.value = track.compressor.threshold.value;
                compressor.knee.value = track.compressor.knee.value;
                compressor.ratio.value = track.compressor.ratio.value;
                compressor.attack.value = track.compressor.attack.value;
                compressor.release.value = track.compressor.release.value;
            }

            // Connect the nodes
            source.connect(gain);
            gain.connect(pan);
            
            if (track.compressorEnabled) {
                pan.connect(compressor);
                compressor.connect(lowEQ);
            } else {
                pan.connect(lowEQ);
            }
            
            lowEQ.connect(midEQ);
            midEQ.connect(highEQ);
            highEQ.connect(offlineMaster);

            return source;
        }).filter(Boolean);

        // Start all sources
        offlineTracks.forEach(source => source.start());

        try {
            // Render the audio
            const renderedBuffer = await offlineCtx.startRendering();

            // Create WAV file
            const wav = this.audioBufferToWav(renderedBuffer);
            const blob = new Blob([wav], { type: 'audio/wav' });

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'mix_export.wav';
            link.click();

            // Cleanup
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting mix:', error);
            alert('Error exporting mix. Please try again.');
        }
    }

    audioBufferToWav(buffer) {
        const numChannels = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const format = 1; // PCM
        const bitDepth = 16;
        
        const bytesPerSample = bitDepth / 8;
        const blockAlign = numChannels * bytesPerSample;
        
        const data = this.interleaveChannels(buffer);
        const dataSize = data.length * bytesPerSample;
        const fileSize = 36 + dataSize;
        
        const headerBuffer = new ArrayBuffer(44);
        const view = new DataView(headerBuffer);
        
        // Write WAV header
        this.writeString(view, 0, 'RIFF');
        view.setUint32(4, fileSize, true);
        this.writeString(view, 8, 'WAVE');
        this.writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, format, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitDepth, true);
        this.writeString(view, 36, 'data');
        view.setUint32(40, dataSize, true);
        
        // Convert audio data to 16-bit PCM
        const pcmData = new Int16Array(data.length);
        for (let i = 0; i < data.length; i++) {
            const s = Math.max(-1, Math.min(1, data[i]));
            pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        // Combine header and audio data
        const wavBuffer = new Uint8Array(headerBuffer.byteLength + pcmData.buffer.byteLength);
        wavBuffer.set(new Uint8Array(headerBuffer));
        wavBuffer.set(new Uint8Array(pcmData.buffer), headerBuffer.byteLength);
        
        return wavBuffer;
    }
    
    interleaveChannels(buffer) {
        const numChannels = buffer.numberOfChannels;
        const length = buffer.length;
        const result = new Float32Array(length * numChannels);
        
        for (let channel = 0; channel < numChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                result[i * numChannels + channel] = channelData[i];
            }
        }
        
        return result;
    }
    
    writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    initUI() {
        this.mixerConsole = document.getElementById('mixerConsole');
        this.trackTemplate = document.getElementById('channelStripTemplate');
        this.trackCount = document.getElementById('trackCount');
        
        // Initialize Modal
        this.modal = document.getElementById('eqModal');
        this.currentTrack = null;
        
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Close button handler
        this.modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });
        
        // Tab switching
        const tabs = this.modal.querySelectorAll('.modal-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const clickedTab = e.target;
                const tabType = clickedTab.getAttribute('data-tab');
                
                // Update tabs
                this.modal.querySelectorAll('.modal-tab').forEach(t => {
                    t.classList.remove('active');
                });
                clickedTab.classList.add('active');
                
                // Update panels
                this.modal.querySelectorAll('.modal-panel').forEach(panel => {
                    panel.classList.remove('active');
                });
                
                // Handle different panel class names
                let panelClass;
                switch(tabType) {
                    case 'comp':
                        panelClass = 'comp-controls';
                        break;
                    case 'gate':
                        panelClass = 'gate-controls';
                        break;
                    default:
                        panelClass = `${tabType}-modal-controls`;
                }
                
                const panel = this.modal.querySelector(`.${panelClass}`);
                if (panel) {
                    panel.classList.add('active');
                }
            });
        });
        
        // EQ slider handlers
        const eqSliders = this.modal.querySelectorAll('.eq-slider');
        eqSliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                if (this.currentTrack) {
                    const type = e.target.classList.contains('high-eq') ? 'high' :
                               e.target.classList.contains('mid-eq') ? 'mid' : 'low';
                    this.currentTrack.setEQ(type, parseFloat(e.target.value));
                    
                    // Update value display
                    const valueDisplay = e.target.nextElementSibling;
                    valueDisplay.textContent = `${e.target.value} dB`;
                }
            });
        });

        // Compressor handlers
        const compToggle = this.modal.querySelector('.comp-toggle');
        if (compToggle) {
            compToggle.addEventListener('change', (e) => {
                if (this.currentTrack && this.currentTrackElement) {
                    this.currentTrack.setCompressorEnabled(e.target.checked);
                    const button = this.currentTrackElement.querySelector('.comp-button');
                    if (button) {
                        button.classList.toggle('active', e.target.checked);
                    }
                }
            });
        }

        // Gate handlers
        const gateToggle = this.modal.querySelector('.gate-toggle');
        if (gateToggle) {
            gateToggle.addEventListener('change', (e) => {
                if (this.currentTrack && this.currentTrackElement) {
                    this.currentTrack.setGateEnabled(e.target.checked);
                    const button = this.currentTrackElement.querySelector('.gate-button');
                    if (button) {
                        button.classList.toggle('active', e.target.checked);
                    }
                }
            });
        }

        const gateParams = {
            threshold: { suffix: ' dB', multiplier: 1 },
            attack: { suffix: ' ms', multiplier: 1 },
            hold: { suffix: ' ms', multiplier: 1 },
            release: { suffix: ' ms', multiplier: 1 }
        };

        Object.keys(gateParams).forEach(param => {
            const slider = this.modal.querySelector(`.gate-${param}`);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    if (this.currentTrack) {
                        const value = parseFloat(e.target.value);
                        this.currentTrack.setGateParam(param, value);
                        
                        // Update value display
                        const valueDisplay = e.target.nextElementSibling;
                        if (valueDisplay) {
                            const displayValue = value * gateParams[param].multiplier;
                            valueDisplay.textContent = displayValue + gateParams[param].suffix;
                        }
                    }
                });
            }
        });

        const compControls = {
            threshold: { suffix: ' dB', multiplier: 1 },
            knee: { suffix: ' dB', multiplier: 1 },
            ratio: { suffix: ':1', multiplier: 1 },
            attack: { suffix: ' ms', multiplier: 1000 },
            release: { suffix: ' ms', multiplier: 1000 }
        };

        Object.keys(compControls).forEach(param => {
            const slider = this.modal.querySelector(`.comp-${param}`);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    if (this.currentTrack) {
                        const value = parseFloat(e.target.value);
                        this.currentTrack.setCompressorParam(param, value);
                        
                        // Update value display
                        const valueDisplay = e.target.nextElementSibling;
                        if (valueDisplay) {
                            const displayValue = value * compControls[param].multiplier;
                            valueDisplay.textContent = displayValue + compControls[param].suffix;
                        }
                    }
                });
            }
        });
    }

    openModal(track, trackElement, type = 'eq') {
        if (!track || !trackElement) return;
        
        this.currentTrack = track;
        this.currentTrackElement = trackElement;
        const trackName = trackElement.querySelector('.track-name')?.value || 'Track';
        const trackNameElement = document.getElementById('eqTrackName');
        if (trackNameElement) {
            trackNameElement.textContent = trackName;
        }
        
        // Set current EQ values
        const eqValues = track.getEQValues();
        const modal = this.modal;
        
        // Update EQ values
        ['high', 'mid', 'low'].forEach(band => {
            const slider = modal.querySelector(`.${band}-eq`);
            const valueDisplay = slider?.nextElementSibling;
            if (slider) {
                slider.value = eqValues[band];
                if (valueDisplay) {
                    valueDisplay.textContent = `${slider.value} dB`;
                }
            }
        });

        // Set current compressor values
        const compValues = track.getCompressorValues();
        const compToggle = modal.querySelector('.comp-toggle');
        if (compToggle) {
            compToggle.checked = compValues.enabled;
        }

        // Update compressor values
        const compParams = {
            threshold: { suffix: ' dB', multiplier: 1 },
            knee: { suffix: ' dB', multiplier: 1 },
            ratio: { suffix: ':1', multiplier: 1 },
            attack: { suffix: ' ms', multiplier: 1000 },
            release: { suffix: ' ms', multiplier: 1000 }
        };

        Object.entries(compParams).forEach(([param, format]) => {
            const slider = modal.querySelector(`.comp-${param}`);
            const valueDisplay = slider?.nextElementSibling;
            if (slider) {
                slider.value = compValues[param];
                if (valueDisplay) {
                    const displayValue = compValues[param] * format.multiplier;
                    valueDisplay.textContent = `${displayValue}${format.suffix}`;
                }
            }
        });

        // Set current gate values
        const gateValues = track.getGateValues();
        const gateToggle = modal.querySelector('.gate-toggle');
        if (gateToggle) {
            gateToggle.checked = gateValues.enabled;
        }

        // Update gate values
        const gateParams = {
            threshold: { suffix: ' dB', multiplier: 1 },
            attack: { suffix: ' ms', multiplier: 1 },
            hold: { suffix: ' ms', multiplier: 1 },
            release: { suffix: ' ms', multiplier: 1 }
        };

        Object.entries(gateParams).forEach(([param, format]) => {
            const slider = modal.querySelector(`.gate-${param}`);
            const valueDisplay = slider?.nextElementSibling;
            if (slider) {
                slider.value = gateValues[param];
                if (valueDisplay) {
                    const displayValue = gateValues[param] * format.multiplier;
                    valueDisplay.textContent = `${displayValue}${format.suffix}`;
                }
            }
        });

        // Switch to the correct tab
        const tabs = modal.querySelectorAll('.modal-tab');
        const panels = modal.querySelectorAll('.modal-panel');
        
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === type);
        });
        
        panels.forEach(panel => {
            let isActive;
            switch(type) {
                case 'comp':
                    isActive = panel.classList.contains('comp-controls');
                    break;
                case 'gate':
                    isActive = panel.classList.contains('gate-controls');
                    break;
                default:
                    isActive = panel.classList.contains(`${type}-modal-controls`);
            }
            panel.classList.toggle('active', isActive);
        });
        
        this.modal.classList.add('show');
    }

    closeModal() {
        this.modal.classList.remove('show');
        this.currentTrack = null;
        this.currentTrackElement = null;
    }

    setupEventListeners() {
        document.getElementById('addTrackBtn').addEventListener('click', () => this.addTrack());
        document.getElementById('playButton').addEventListener('click', () => this.playAll());
        document.getElementById('stopButton').addEventListener('click', () => this.stopAll());
        document.getElementById('pauseButton').addEventListener('click', () => this.pauseAll());
        document.getElementById('masterFader').addEventListener('input', (e) => this.setMasterVolume(e.target.value));
        document.getElementById('exportMixButton').addEventListener('click', () => this.exportMix());
    }

    async addTrack() {
        if (this.tracks.length >= 16) {
            alert('Maximum number of tracks (16) reached');
            return;
        }

        const track = new AudioTrack(this.context, this.masterGain);
        
        // Create UI for track
        const trackElement = this.trackTemplate.content.cloneNode(true);
        const trackStrip = trackElement.querySelector('.channel-strip');
        
        // Store meter reference in track object
        track.meterElement = trackStrip.querySelector('.meter-fill');
        this.tracks.push(track);
        
        // Set track number
        const trackNumber = trackStrip.querySelector('.track-number');
        trackNumber.textContent = `Track ${this.tracks.length}`;
        
        // Setup file input and upload area
        const fileInput = trackStrip.querySelector('.track-file-input');
        const uploadArea = trackStrip.querySelector('.track-upload');
        
        // Make the upload area clickable
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // Setup EQ and Compressor buttons
        const eqButton = trackStrip.querySelector('.eq-button');
        const compButton = trackStrip.querySelector('.comp-button');
        const gateButton = trackStrip.querySelector('.gate-button');
        
        eqButton.addEventListener('click', () => {
            this.openModal(track, trackStrip, 'eq');
        });
        
        compButton.addEventListener('click', () => {
            this.openModal(track, trackStrip, 'comp');
        });

        gateButton.addEventListener('click', () => {
            this.openModal(track, trackStrip, 'gate');
        });

        // Handle drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#2196F3';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#666';
        });

        uploadArea.addEventListener('drop', async (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('audio/')) {
                await handleFileUpload(file);
            }
        });

        // Handle file selection
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                await handleFileUpload(file);
            }
        });

        // File upload handler
        const handleFileUpload = async (file) => {
            uploadArea.style.borderColor = '#666';
            try {
                const success = await track.loadFile(file);
                if (success) {
                    trackStrip.classList.add('has-audio');
                    uploadArea.style.borderColor = '#00ff00';
                    uploadArea.innerHTML = `<i class="bi bi-music-note"></i><br>${file.name}`;
                    uploadArea.style.fontSize = '10px';
                    uploadArea.style.textAlign = 'center';
                    uploadArea.style.wordBreak = 'break-word';
                } else {
                    uploadArea.style.borderColor = '#ff0000';
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                uploadArea.style.borderColor = '#ff0000';
            }
        };
        
        // Setup controls
        const fader = trackStrip.querySelector('.fader');
        const faderValue = trackStrip.querySelector('.fader-value');
        fader.addEventListener('input', (e) => {
            const value = e.target.value / 100;
            track.setVolume(value);
            faderValue.textContent = `${(Math.log10(value) * 20).toFixed(1)} dB`;
        });
        
        const panControl = trackStrip.querySelector('.pan-control');
        const panValue = trackStrip.querySelector('.pan-value');
        panControl.addEventListener('input', (e) => {
            const value = e.target.value / 50;
            track.setPan(value);
            panValue.textContent = 
                value < 0 ? `${Math.abs(value * 100).toFixed(0)}L` :
                value > 0 ? `${(value * 100).toFixed(0)}R` : 'C';
        });
        
        // Setup EQ
        const eqControls = trackStrip.querySelectorAll('.eq-control');
        eqControls.forEach(control => {
            control.addEventListener('input', (e) => {
                const type = control.classList.contains('high-eq') ? 'high' :
                           control.classList.contains('mid-eq') ? 'mid' : 'low';
                track.setEQ(type, parseFloat(e.target.value));
            });
        });
        
        // Setup mute/solo
        const muteBtn = trackStrip.querySelector('.mute-button');
        muteBtn.addEventListener('click', () => {
            track.toggleMute();
            muteBtn.classList.toggle('active');
        });
        
        const soloBtn = trackStrip.querySelector('.solo-button');
        soloBtn.addEventListener('click', () => {
            track.toggleSolo();
            soloBtn.classList.toggle('active');
            this.updateSoloState();
        });
        
        // Add track to mixer
        this.mixerConsole.insertBefore(trackStrip, this.mixerConsole.lastElementChild);
        this.updateTrackCount();
    }

    updateTrackCount() {
        this.trackCount.textContent = `${this.tracks.length}/16 tracks`;
    }

    playAll() {
        if (!this.isPlaying) {
            // Get all tracks with valid buffers and pause times
            const validTracks = this.tracks.filter(t => t.buffer && typeof t.pauseTime === 'number');
            
            // Calculate the start time
            let startTime = 0;
            if (validTracks.length > 0) {
                const pauseTimes = validTracks.map(t => t.pauseTime);
                startTime = Math.max(0, Math.min(...pauseTimes));
            }
            
            // Play all tracks from the calculated start time
            this.tracks.forEach(track => {
                if (track.buffer) {
                    track.play(startTime);
                }
            });
            
            this.isPlaying = true;
        }
    }

    stopAll() {
        this.tracks.forEach(track => track.stop());
        this.isPlaying = false;
    }

    pauseAll() {
        this.tracks.forEach(track => track.pause());
        this.isPlaying = false;
    }

    setMasterVolume(value) {
        const normalizedValue = value / 100;
        this.masterGain.gain.value = normalizedValue;
        document.getElementById('masterFaderValue').textContent = 
            `${(Math.log10(normalizedValue) * 20).toFixed(1)} dB`;
    }

    updateSoloState() {
        const hasSoloedTracks = this.tracks.some(t => t.soloed);
        
        this.tracks.forEach(track => {
            const shouldPlay = !hasSoloedTracks || track.soloed;
            track.setVolume(shouldPlay && !track.muted ? 0.75 : 0);
        });
    }

    startMetering() {
        const masterMeterL = document.getElementById('masterMeterL');
        const masterMeterR = document.getElementById('masterMeterR');
        
        const updateMeters = () => {
            // Update master meters
            const masterData = new Float32Array(2048);
            this.masterAnalyser.getFloatTimeDomainData(masterData);
            
            let sumL = 0, sumR = 0;
            for (let i = 0; i < masterData.length; i += 2) {
                sumL += masterData[i] * masterData[i];
                sumR += masterData[i + 1] * masterData[i + 1];
            }
            
            const rmsL = Math.sqrt(sumL / (masterData.length / 2));
            const rmsR = Math.sqrt(sumR / (masterData.length / 2));
            
            masterMeterL.style.height = `${Math.min(100, rmsL * 200)}%`;
            masterMeterR.style.height = `${Math.min(100, rmsR * 200)}%`;
            
            // Update individual track meters
            this.tracks.forEach(track => {
                if (track.meterElement && track.analyser) {
                    const trackData = new Float32Array(1024);
                    track.analyser.getFloatTimeDomainData(trackData);
                    
                    let sum = 0;
                    for (let i = 0; i < trackData.length; i++) {
                        sum += trackData[i] * trackData[i];
                    }
                    const rms = Math.sqrt(sum / trackData.length);
                    track.meterElement.style.height = `${Math.min(100, rms * 200)}%`;
                }
            });
            
            requestAnimationFrame(updateMeters);
        };
        
        updateMeters();
    }
}

// Initialize mixer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.mixer = new Mixer();
});