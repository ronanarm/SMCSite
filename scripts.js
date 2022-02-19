
//Loop over Mics to Add to Page
Object.keys(mics).forEach(key => {
    createMic(key, mics[key]);
});

let flashOn = false;

function createMic (micName, micData){
    let polars = "";
    micData.polar.forEach(value => {
            polars += `<li>${value}</li>`
    })
    let usedOn = "";
    micData.uses.forEach(value => {
        usedOn += `<li>${value}</li>`
    })
    let char = "";
    micData.char.forEach(value => {
        char += `<li>${value}</li>`
    })
    let toPush = `
    
    <div class="micObj">
    <div class="flashContainer">
        <div class="micHead">
            <h4>${micName} <small>${micData.manufacturer} <button class="micImgOpen btn" onclick="showImage(this)">View Image</button></small></h4>
            <div class="micType">
                <span>${micData.type}</span>
            </div>
            <div class="modalBack"></div>
            <div class="micImgBox">
                <img src="${micData.img}">
            </div>
            
        </div>
        <div class="flashMicDetails">
            <h4>${micName} <small style="display:inline-block;">${micData.manufacturer}</small></h4>
            <div>${micData.type}</div>
        </div>
        <div class="micBody">
            <div class="specTable">
                <div>
                    <b>Has a Pad</b>
                    <span class="caps">${micData.hasPad}</span>
                </div>
                <div>
                    <b>Polar Patterns</b>
                    <span>
                        <ul class="polarList">
                            ${polars}
                        </ul>
                    </span>
                </div>
                <div>
                    <b>Maximum SPL</b>
                    <span>
                        <span class="maxSPL">${micData.SPL}</span>dB
                    </span>
                </div>
                <div>
                    <b>Requires Phantom Power</b>
                    <span>
                        <span class="phantom">${micData.phantom}</span>
                    </span>
                </div>
                <div>
                    <b>Frequency Response</b>
                    <span>
                        <span class="lowFreq">${micData.lowestFreq}</span>Hz - <span class="highFreq">${micData.highestFreq}</span>kHz
                    </span>
                </div>
                <div>
                    <b>Lending Level</b>
                    <span class="lendLevel">
                        ${micData.lendingLevel}
                    </span>
                </div>
            </div>
            <div class="usedOn">
                <b>Often Used On:</b>
                <ul class="usedOnUL">
                    ${usedOn}
                </ul>
            </div>
            <div class="characteristics">
                <b>Characteristics:</b>
                <ul class="charUL">
                    ${char}
                </ul>
            </div>
        </div>
        </div>
    </div>
    
    `
    document.getElementById("gearList").innerHTML += toPush;
}   

let filters = {};

let showMic = (mic) => {
    if(!mic.classList.contains("active")){
        mic.classList.add("active")
    }
}

let showImage = (button) => {
    button.closest(".micObj").querySelector(".modalBack").classList.add("active")
    button.closest(".micObj").querySelector(".micImgBox").classList.add("active")
}
document.addEventListener('click',function(e){
    if(e.target && e.target.classList.contains("modalBack")){
          e.target.classList.remove("active")
          e.target.parentElement.querySelector(".micImgBox").classList.remove("active")
     }
     if(flashOn){
        let targetParent = e.target.closest(".micObj")
        if(e.target && targetParent){
            targetParent.classList.toggle("flashcardActive");
        }
     }
     
 });

let meetsConditions = (mic) => {
    if(mic.classList.contains("active")){
        mic.classList.remove("active")
    }
    if(filters.type?.length > 0){
        let thisType = mic.querySelector(".micType");
        if(!filters.type.some(t => thisType.textContent.includes(t))){
            return
        }
    }
    if(filters.polar?.length > 0){
        let thisType = mic.querySelector(".polarList");
        if(!filters.polar.some(t => thisType.textContent.includes(t))){
            return
        }
    }
    if(filters.lowFreq?.length > 0){
        let micFreq = parseInt(mic.querySelector(".lowFreq").innerHTML);
        if(micFreq > filters.lowFreq){
            return
        }
    }
    if(filters.highFreq?.length > 0){
        let micFreq = parseInt(mic.querySelector(".highFreq").innerHTML);
        if(micFreq < filters.highFreq){
            return
        }
    }
    if(filters.spl?.length > 0){
        let micSPL = parseInt(mic.querySelector(".maxSPL").innerHTML);
        if(micSPL < filters.spl){
            return
        }
    }
    if(filters.uses?.length > 0){
        let thisType = mic.querySelector(".usedOnUL");
        if(!filters.uses.some(t => thisType.textContent.includes(t))){
            return
        }
    }
    if(filters.chars?.length > 0){
        let thisType = mic.querySelector(".charUL");
        if(!filters.chars.some(t => thisType.textContent.includes(t))){
            return
        }
    }
    if(filters.level?.length > 0){
        let thisType = mic.querySelector(".lendLevel");
        if(!filters.level.some(t => thisType.textContent.includes(t))){
            return
        }
    }
    showMic(mic)
    
}

let update = () => {
    console.log("Updating Filters")
    let arrayOfMics = Array.from(document.getElementsByClassName("micObj"));
    if(Object.keys(filters).length == 0){
        arrayOfMics.forEach((mic) => {
            showMic(mic)
        })
        return
    }
    arrayOfMics.forEach((mic) =>{
        meetsConditions(mic);
    })
}
update()

let clearFilters = () => {
    document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        checkbox.checked = false;
    })
    filters = {}
    update()
}
let updateFilter = (checkbox, valToUpdate) => {
    if(valToUpdate == "type" || valToUpdate == "polar" || valToUpdate == "uses" || valToUpdate == "chars" || valToUpdate == "level"){
        modifyFilterArray(checkbox.value, valToUpdate, checkbox.checked)
    }
    if(valToUpdate == "lowFreq" || valToUpdate == "highFreq" || valToUpdate == "spl"){
        filters[valToUpdate] = checkbox.value;
    }
    update()
}

let modifyFilterArray = (value, valToUpdate, bool) => {
    if(bool){
        if(!filters[valToUpdate]){
            filters[valToUpdate] = []
        }
        if(!filters[valToUpdate].includes(value)){
            filters[valToUpdate].push(value)
        }
    }else{
        if(filters[valToUpdate]?.includes(value)){
            arrayRemove(filters[valToUpdate], value)
        }
    }
    
}

let arrayRemove = (array, value) => { 
    for( var i = 0; i < array.length; i++){ 
        if ( array[i] == value) { 
            array.splice(i, 1); 
        }
    }
}
let inputUpdate = (input) => {
    input.parentElement.querySelector("i").innerHTML = input.value
}

let toggleFilters = () => {
    document.querySelector(".filters").classList.toggle("active")
}

let beginFlashcards = () => {
    console.log('Beginning Flash Cards')
    flashOn = true;
    document.getElementById("gearList").classList.add("flashcards")
    document.getElementById("body").classList.add("bodyFlash")

}
let closeFlashcards = () => {
    console.log('Ending Flash Cards')
    flashOn = false;
    document.getElementById("gearList").classList.remove("flashcards")
    document.getElementById("body").classList.remove("bodyFlash")
}
let nextFlashcard = () => {
    let widthToScroll = document.getElementById("gearList").querySelector(".active").offsetWidth;
    console.log(widthToScroll)
    document.getElementById('gearList').scrollLeft += widthToScroll;
  };
  let previousFlashcard = () => {
    let widthToScroll = document.getElementById("gearList").querySelector(".active").offsetWidth;
    
    console.log(widthToScroll)
    document.getElementById('gearList').scrollLeft -= widthToScroll;
  };