let globalEarVars = {
    type: "boost",
    amount: 6,
    questions: 5,
    audioSource:"audioFiles/PinkNoise.wav",
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
function getBetween(min, max) {
    return roundAnswer(Math.random() * (max - min) + min);
  }

let logScaler = (base, RNG) => {
    if(RNG < 50){
        let returnValue = base * 10;
        return returnValue + RNG
    }
    else if(RNG < 250){
        let returnValue = base * 40;
        return returnValue + RNG
    }
    else if(RNG < 500){
        let returnValue = base * 80;
        return returnValue + RNG
    }
    else if(RNG < 1000){
        let returnValue = base * 160;
        return returnValue + RNG
    }
    else if(RNG < 2000){
        let returnValue = base * 450;
        return returnValue + RNG
    }
    else if (RNG < 4000){
        let returnValue = base * 600;
        return returnValue + RNG
    }
    else if (RNG < 6000){
        let returnValue = base * 1000;
        return returnValue + RNG
    }
    else if (RNG < 8000){
        let returnValue = base * 1500;
        return returnValue + RNG
    }
    else if (RNG < 16000){
        let returnValue = base * 2500;
        return returnValue + RNG
    }
    else{
        let returnValue = base * 5000;
        return returnValue + RNG
    }

  

    

}

let roundAnswer = (inputValue) => {
    if(inputValue > 99 && inputValue < 1500){
        //console.log(`Rounded Correct Value to ${inputValue}`)
        return Math.ceil(inputValue / 10) * 10;
        
    }
    else if(inputValue >= 1500){
        //console.log(`Rounded Correct Value to ${inputValue}`)
        return Math.ceil(inputValue / 100) * 100;
        
    }
    else{
        return Math.ceil(inputValue)
    }
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
        //console.log("Changing Time to " + seekSlider.value)
        audioSource.currentTime = seekSlider.value;
    });
    audioSource.addEventListener('timeupdate', () => {
        //console.log("Updating Time to " + audioSource.currentTime)
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
    document.querySelector(".audioQuiz").innerHTML = `<div class="audioQuizLoading"><span>Loading</span></div>`;
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
        //console.log("Ready State at 0")
        audioSource.addEventListener('loadedmetadata', () => {
            document.querySelector(".audioQuizLoading").classList.add("loaded");
            displayAudioDuration(audioSource.duration, audioPlayer, audioSource);
            audioPlayer.closest(".audioQuizQuestion").classList.remove("renderingQuestion")
        });
    }

})

let modifiedAudioPlayers = document.querySelectorAll(".modifiedAudio");
modifiedAudioPlayers.forEach(modAudioPlayer => {
    
    //Initialize Audio Context
    let context = new (window.AudioContext || window.webkitAudioContext)();
    var audioElement = modAudioPlayer.querySelector('audio');

    //Create Audio Source
    var source = context.createMediaElementSource(audioElement);

    //Create the EQ Filter
    let highShelf = context.createBiquadFilter();
    source.connect(highShelf);
    highShelf.connect(context.destination);

    //Get Random Weighted Number (favoring low frequencies)
    var weighted = Math.pow(Math.random(), 3);

    //Generate the Correct Value
    var RNG = roundAnswer(Math.floor(weighted * (15000)) + 30);
    
    
    //Get correct answer position
    let answerPosition = 1;
    if(RNG < 50){
        answerPosition = Math.floor(Math.random() * 2);
    }else{
        answerPosition = Math.floor(Math.random() * 4);
    }
    

    //create array for answers
    let answers = [0, 0, 0, 0]

    //Push correct value into array
    answers[answerPosition] = RNG;

    //create a function to round the answers baseed on a logarithmic scale

    if(answerPosition == 0){
        
        answers[1] = roundAnswer(logScaler(1, RNG))
        answers[2] = roundAnswer(logScaler(2, RNG))
        answers[3] = roundAnswer(logScaler(3, RNG))
    }
    if(answerPosition == 1){
        answers[0] = roundAnswer(logScaler(-1, RNG))
        answers[2] = roundAnswer(logScaler(1, RNG))
        answers[3] = roundAnswer(logScaler(2, RNG))
        
    }
    if(answerPosition == 2){
        answers[0] = roundAnswer(logScaler(-2, RNG))
        answers[1] = roundAnswer(logScaler(-1, RNG))
        answers[3] = roundAnswer(logScaler(1, RNG))
        
    }
    if(answerPosition == 3){
        answers[0] = roundAnswer(logScaler(-3, RNG))
        answers[1] = roundAnswer(logScaler(-2, RNG))
        answers[2] = roundAnswer(logScaler(-1, RNG))
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
    //console.log(gainAmount)
    highShelf.type = "peaking";
    highShelf.frequency.value = RNG;
    highShelf.gain.value = gainAmount;
    highShelf.Q.value = 3;
    
})

}



