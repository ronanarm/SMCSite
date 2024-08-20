let randomHTML = "";
let randomObj = {};

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
        let gearPosition = Object.keys(randomObj).length + 1;
        objectDetails.type = type;
        objectDetails.position = gearPosition;
        randomObj[type] = (objectDetails);
        randomHTML = randomHTML + objHTML;
    }
}

let generateRandom = () => {
    console.log("Generating")
    randomHTML = "";
    pushToRandomObj(mics, "Microphone", "Mic")
    
    if(document.querySelector('input[value="Input"]').checked){
        
        let inputValue = getRandomInt(60);
        let gearPosition = Object.keys(randomObj).length + 1;
        randomObj.micLine = {position: gearPosition, type: "Input",in: `Wall Plate Input ${inputValue}`, out: `Mic Line ${inputValue}`}
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
        let gearPosition = Object.keys(randomObj).length + 1;
        randomObj.dawInput = {position: gearPosition, type: "daw", in: `DAW Input ${inputValue}`, out: `DAW Output ${inputValue}`}
        randomHTML += htmlPush;
    }
    let solutionHTML = getSolution();
    var solutionButton = `<div>
            <span><button class="showDetails btn" onclick="showDetails(this)">Solution</button></span>
            <button class="blackBack" onclick="showDetails(this)"></button>
            <div class="outboardDetails solutionDetails">
                ${solutionHTML}
            </div>
        </div>`;
        console.log(randomObj)
    randomHTML = `<div class="randomAnswer">${randomHTML} ${solutionButton}</div>`
    document.getElementById("gearList").innerHTML = randomHTML
}
const randomProp = obj => Object.keys(obj)[(Math.random() * Object.keys(obj).length) | 0];
function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  let showDetails = (thi) => {
    thi.closest("div").classList.toggle("activeDetails")
  }


function getSolution() {
    console.log(randomObj);
    let solveText = {};
    //Get the Length of the RandomObj
    let randomObjLength = Object.keys(randomObj).length;
    //for each item in the randomObj except the first, do something
    for(let i = 2; i <= randomObjLength; i++){
        //find the object within the randomObj that has a position of i
        let stepPosition = i - 1;
        let currentObj = Object.values(randomObj).find(obj => obj.position === i);
        //get the previous object
        let previousObj = Object.values(randomObj).find(obj => obj.position === i - 1);
        if(!currentObj){
            return "Something went wrong when finding a solution."
        }
        if(currentObj.type == "Input"){
            solveText[stepPosition] = `Connect your microphone to ${currentObj.in} on the wall.`;
        }
        if(currentObj.type == "Preamp"){
            solveText[stepPosition] = `Connect your input to your Mic Preamp by patching ${previousObj.out} to ${currentObj.in}. `;
        }
        if(currentObj.type == "Equalizer"){
            solveText[stepPosition] = `Connect your ${previousObj.type} to your Equalizer by connecting ${previousObj.out} to ${currentObj.in}. `;
        }
        if(currentObj.type == "Compressor"){
            solveText[stepPosition] = `Connect your ${previousObj.type} to your Compressor by connecting ${previousObj.out} to ${currentObj.in}. `;
        }
        if(currentObj.type == "daw"){
            solveText[stepPosition] = `Connect your ${previousObj.type} to the computer DAW input by connecting ${previousObj.out} to ${currentObj.in}. `;
        }
        
    }
    if(randomObj.Microphone){
        let solveStep = Object.keys(solveText).length + 1;
        if(randomObj.Microphone.phantom == "YES"){
            solveText[solveStep] = `Because this microphone requires phantom power, turn on Phantom Power on the Mic Preamp. `;
        }
        else{
            solveText[solveStep] = `Because this microphone does not require phantom power, ensure that is turned off on the Mic Preamp. `;
        }
        
    }
    
    let solveHTML = "";
    for (const property in solveText) {
        solveHTML += `<h3>Step ${property}</h3><p>${solveText[property]}</p>`
    }
    return solveHTML
  
    
}