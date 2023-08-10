let globalEarVars = {
    type: "boost",
    amount: 6,
    questions: 5,
    audioSource:"audioFiles/WhiteNoise.wav",
}

let setGlobalEarTraining = (propToSet, value) => {
    globalEarVars[propToSet] = value;
}

let uploadEarTraining = () => {
    console.log("Starting Upload")
    let input = document.getElementById("fileUploadAudioSource");
    input.click();
}
let setGlobalEarTrainingFile = (file) => {
    let inputPath = URL.createObjectURL(document.getElementById('fileUploadAudioSource').files[0]);
    globalEarVars.audioSource = inputPath;
    
}

let displayAudioDuration = (audioDuration, audioPlayer, audioSource) => {
    
    const calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${returnedSeconds}`;
      }
    let parsedTime = calculateTime(audioDuration)
    audioPlayer.querySelector(".duration").innerHTML = parsedTime;

    //Slider Movement
    let seekSlider = audioPlayer.querySelector(".rangeSlider");
    seekSlider.max = Math.floor(audioDuration);
    seekSlider.addEventListener('input', () => {
        let currentTimeContainer = audioPlayer.querySelector(".currentTime")
        currentTimeContainer.textContent = calculateTime(seekSlider.value);
      });
    seekSlider.addEventListener('change', () => {
        console.log("Changing Time to " + seekSlider.value)
        audioSource.currentTime = seekSlider.value;
    });
    audioSource.addEventListener('timeupdate', () => {
        console.log("Updating Time to " + audioSource.currentTime)
        seekSlider.value = Math.floor(audioSource.currentTime);
      });

      //Play Icon
    let playIconContainer = audioPlayer.querySelector(".playAudio");
    let isPlaying = false;
    audioSource.onplaying = function() {
        playIconContainer.innerHTML = `<svg id="i-pause" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M23 2 L23 30 M9 2 L9 30" />
    </svg>`
        isPlaying = true;
      };
      audioSource.onpause = function() {
        playIconContainer.innerHTML = `<svg id="i-play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M10 2 L10 30 24 16 Z" />
    </svg>`
        isPlaying = false;
      };
    playIconContainer.addEventListener('click', () => {
        if(!isPlaying){
            document.querySelectorAll('audio').forEach(source => source.pause());
        }
        isPlaying ? audioSource.pause() : audioSource.play();
    });
    
}



let createEQQuiz = () => {
    console.log("Creating Quiz")
    document.querySelector(".audioQuiz").innerHTML = "";
    for (let i = 0; i < globalEarVars.questions; i++) {
        let qNumber = i + 1;
        const htmlToInject = `
<div class="audioQuizQuestion renderingQuestion">
<h3>Question ${qNumber}</h3>
<div class="questionContents">
            <div class="audioSources">
                <div class="audioPlayer">
                    <audio src="${globalEarVars.audioSource}" preload="metadata" class="audioPlayerModule"></audio>
                    <span class="playerTitle">Original Audio</span>
                    <!-- swaps with pause icon -->
                    <div class="playerControls">
                        <button class="playAudio">
                            <svg id="i-play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                                <path d="M10 2 L10 30 24 16 Z" />
                            </svg>
                        </button>
                        <input type="range" class="rangeSlider" max="100" value="0">
        
                        <span class="times">
                            <span class="currentTime time">0:00</span> /
                            <span class="duration time">0:00</span>
                        </span>
                    </div>
                </div>
                <div class="audioPlayer modifiedAudio">
                    <audio src="${globalEarVars.audioSource}" preload="metadata" class="audioPlayerModule" crossorigin></audio>
                    <span class="playerTitle">Modified Audio</span>
                    <!-- swaps with pause icon -->
                    <div class="playerControls">
                        <button class="playAudio">
                            <svg id="i-play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                                <path d="M10 2 L10 30 24 16 Z" />
                            </svg>
                        </button>
                        <input type="range" class="rangeSlider" max="100" value="0">
        
                        <span class="times">
                            <span class="currentTime time">0:00</span> /
                            <span class="duration time">0:00</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="audioAnswers">
                <button class="audioAnswer aa0">10Hz</button>
                <button class="audioAnswer aa1">10Hz</button>
                <button class="audioAnswer aa2">10Hz</button>
                <button class="audioAnswer aa3">10Hz</button>
            </div>
            </div>
            
        </div>`

        document.querySelector(".audioQuiz").innerHTML += htmlToInject;

    }
    
let audioPlayers = document.querySelectorAll(".audioPlayer");
audioPlayers.forEach(audioPlayer => {
    
    let audioSource = audioPlayer.querySelector("audio")

    if (audioSource.readyState > 0) {
        displayAudioDuration(audioSource.duration, audioPlayer, audioSource);
        audioPlayer.closest(".audioQuizQuestion").classList.remove("renderingQuestion")
    } 
    if(audioSource.readyState == 0) {
        console.log("Ready State at 0")
        audioSource.addEventListener('loadedmetadata', () => {
            displayAudioDuration(audioSource.duration, audioPlayer, audioSource);
            audioPlayer.closest(".audioQuizQuestion").classList.remove("renderingQuestion")
        });
    }

})

let modifiedAudioPlayers = document.querySelectorAll(".modifiedAudio");
modifiedAudioPlayers.forEach(modAudioPlayer => {
    
    let context = new (window.AudioContext || window.webkitAudioContext)();
    var audioElement = modAudioPlayer.querySelector('audio');
    var source = context.createMediaElementSource(audioElement);
    let highShelf = context.createBiquadFilter();
    source.connect(highShelf);
    highShelf.connect(context.destination);

    var weighted = Math.pow(Math.random(), 2);
    var RNG = Math.floor(weighted * (12000 - 20 + 1)) + 20;
    
    let answerPosition = Math.floor(Math.random() * 4);
    let answers = [0, 0, 0, 0]
    answers[answerPosition] = RNG;
    if(answerPosition == 0){
        answers[1] = Math.floor(1.2 * RNG)
        answers[2] = Math.floor(1.4 * RNG)
        answers[3] = Math.floor(1.6 * RNG)
        
    }
    if(answerPosition == 1){
        answers[0] = Math.floor(0.8 * RNG)
        answers[2] = Math.floor(1.2 * RNG)
        answers[3] = Math.floor(1.4 * RNG)
        
    }
    if(answerPosition == 2){
        answers[0] = Math.floor(0.6 * RNG)
        answers[1] = Math.floor(0.8 * RNG)
        answers[3] = Math.floor(1.2 * RNG)
        
    }
    if(answerPosition == 3){
        answers[0] = Math.floor(0.4 * RNG)
        answers[1] = Math.floor(0.6 * RNG)
        answers[2] = Math.floor(0.8 * RNG)
    }
    let i = 0;
    answers.forEach((answer, i) => {
        let answerObject = modAudioPlayer.closest(".audioQuizQuestion").querySelector(`.aa${i}`)
        if(answerPosition == i){
            
            answerObject.innerHTML = `${answer} Hz`
            answerObject.addEventListener('click', () => {
                console.log("Marking as correct")
                answerObject.classList.add("correctAnswer")
            });
        }else{
            answerObject.innerHTML = `${answer} Hz`
            answerObject.addEventListener('click', () => {
                console.log("Marking as incorrect")
                answerObject.classList.add("incorrectAnswer")
            });
        }
    })
    let gainAmount = 0;
    if(globalEarVars.type == "boost"){
        gainAmount = globalEarVars.amount;
    }else if(globalEarVars.type == "cut"){
        gainAmount = 0 - globalEarVars.amount
    }else{
        if(Math.random() > 0.5){
            gainAmount = globalEarVars.amount;
        }else{
            gainAmount = 0 - globalEarVars.amount
        }
    }
    console.log(gainAmount)
    highShelf.type = "peaking";
    highShelf.frequency.value = RNG;
    highShelf.gain.value = gainAmount;
    highShelf.Q.value = 3;
    
})

}



