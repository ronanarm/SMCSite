let randomHTML = "";

let pushToRandomObj = (object, type, inputQuery) => {
    if(document.querySelector(`input[value="${inputQuery}"]`).checked){
        let selectedOption = randomProp(object)
        let objectDetails = object[selectedOption];
        let additionalHTML = "";
        let detailsHTML = "";
        let imgHTML = "";
        let addClass = "";
        let patchbayDetails = "";
        for (const property in objectDetails.details) {
            detailsHTML += `<div class="detail"><span>${property}</span><span>${objectDetails.details[property]}</span></div>`;
        }
        if(inputQuery == "Mic"){
            additionalHTML = objectDetails.manufacturer + " ";
            addClass = "unclickable"
        }
        if(inputQuery != "Mic"){
            imgHTML = `<img src="${objectDetails.img}" />`
            patchbayDetails = `
            <br>
            <h4>Patchbay Details</h4>
            <div class="detail"><span>Input</span><span>${objectDetails.in}</span></div>
            <div class="detail"><span>Output</span><span>${objectDetails.out}</span></div>`
        }
        let objHTML = `
        <div>
            <h4>${type}</h4>
            <span><button class="showDetails ${addClass}" onclick="showDetails(this)">${additionalHTML}${selectedOption}</button></span>
            <button class="blackBack" onclick="showDetails(this)"></button>
            <div class="outboardDetails">
                ${imgHTML}
                <div class="detailBlob">
                    <h3>${additionalHTML}${selectedOption}</h3>
                    ${detailsHTML}
                    ${patchbayDetails}
                </div>
            </div>
        </div>`
        randomHTML = randomHTML + objHTML;
    }
}

let generateRandom = () => {
    console.log("Generating")
    randomHTML = "";
    pushToRandomObj(mics, "Microphone", "Mic")
    
    if(document.querySelector('input[value="Input"]').checked){
        let inputValue = getRandomInt(60);
        let htmlPush = `
        <div>
            <h4>Mic Line</h4>
            <span>Input ${inputValue}</span>
        </div>`
        randomHTML += htmlPush;
    }
    pushToRandomObj(preamps, "Preamp", "Pre")
    if(document.querySelector('input[value="EQFirst"]').checked){
        pushToRandomObj(equalizers, "Equalizer", "EQ")
        pushToRandomObj(compressors, "Compressor", "Comp")
    }else if(document.querySelector('input[value="CompFirst"]').checked){
        pushToRandomObj(compressors, "Compressor", "Comp")
        pushToRandomObj(equalizers, "Equalizer", "EQ")
    }else if(Math.random() > 0.5){
        pushToRandomObj(compressors, "Compressor", "Comp")
        pushToRandomObj(equalizers, "Equalizer", "EQ")
    }else{
        pushToRandomObj(equalizers, "Equalizer", "EQ")
        pushToRandomObj(compressors, "Compressor", "Comp")
    }
    
    if(document.querySelector('input[value="DAWIn"]').checked){
        let inputValue = getRandomInt(32);
        let htmlPush = `
        <div>
            <h4>DAW Input</h4>
            <span>Input ${inputValue}</span>
        </div>`
        randomHTML += htmlPush;
    }
    randomHTML = `<div class="randomAnswer">${randomHTML}</div>`
    document.getElementById("gearList").innerHTML = randomHTML
}
const randomProp = obj => Object.keys(obj)[(Math.random() * Object.keys(obj).length) | 0];
function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  let showDetails = (thi) => {
    thi.closest("div").classList.toggle("activeDetails")
  }