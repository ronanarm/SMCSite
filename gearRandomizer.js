let generateRandom = () => {
    console.log("Generating")
    let htmlToPush ="";
    if(document.querySelector('input[value="Mic"]').checked){
        let selectedMic = randomProp(mics)
        let micDetails = mics[selectedMic];
        let micHTML = `
        <div>
            <h4>Microphone</h4>
            <span>${micDetails.manufacturer} ${selectedMic}</span>
        </div>`
        htmlToPush = htmlToPush + micHTML;
    }
    if(document.querySelector('input[value="Input"]').checked){
        let inputValue = getRandomInt(60);
        let htmlPush = `
        <div>
            <h4>Mic Line</h4>
            <span>Input ${inputValue}</span>
        </div>`
        htmlToPush = htmlToPush + htmlPush;
    }
    if(document.querySelector('input[value="Pre"]').checked){
        const randomElement = preamps[Math.floor(Math.random() * preamps.length)];
        let micHTML = `
        <div>
            <h4>Mic Preamp</h4>
            <span>${randomElement}</span>
        </div>`
        htmlToPush = htmlToPush + micHTML;
    }
    if(document.querySelector('input[value="EQ"]').checked){
        const randomElement = equalizers[Math.floor(Math.random() * equalizers.length)];
        let micHTML = `
        <div>
            <h4>Equalizer</h4>
            <span>${randomElement}</span>
        </div>`
        htmlToPush = htmlToPush + micHTML;
    }
    if(document.querySelector('input[value="Comp"]').checked){
        const randomElement = compressors[Math.floor(Math.random() * compressors.length)];
        let micHTML = `
        <div>
            <h4>Compressor</h4>
            <span>${randomElement}</span>
        </div>`
        htmlToPush = htmlToPush + micHTML;
    }
    if(document.querySelector('input[value="DAWIn"]').checked){
        let inputValue = getRandomInt(32);
        let htmlPush = `
        <div>
            <h4>DAW Input</h4>
            <span>Input ${inputValue}</span>
        </div>`
        htmlToPush = htmlToPush + htmlPush;
    }
    htmlToPush = `<div class="randomAnswer">${htmlToPush}</div>`
    document.getElementById("gearList").innerHTML = htmlToPush
}
const randomProp = obj => Object.keys(obj)[(Math.random() * Object.keys(obj).length) | 0];
function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
  }