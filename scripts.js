console.log("Loading Scripts")

const mics = {
    "C414 XLII": {
        "manufacturer": "AKG",
        "image": "https://media.sweetwater.com/api/i/f-webp__q-82__ha-22b8c610c6cea5f4__hmac-3607bfdd9dc6e6b3ddee7500fe9055c4ae994839/images/items/750/C414XLII-large.jpg.auto.webp",
        "polar": ["Cardioid", "Figure-8", "Omni"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 158,
        "hasPad": true,
        "type": "LDC",
        "lendingLevel": 4,
        "uses": [
            "Acoustic Guitar",
            "Electric Guitar",
            "Piano",
            "Violin",
            "Horns",
            "Overheads",
            "Room",
            "General"
        ],
        "char": [
            "Bright",
            "Transparent"
        ]
    },
    "C414 XLS": {
        "manufacturer": "AKG",
        "polar": ["Cardioid", "Figure-8", "Omni"],
        "highestFreq": 20,
        "lowestFreq": 20,
        "SPL": 158,
        "hasPad": true,
        "type": "SDC",
        "lendingLevel": 4,
        "uses": [
            "Acoustic Guitar",
            "Piano",
            "Violin",
            "Horns",
            "Overheads",
            "Room",
            "General"
        ],
        "char": [
            "Bright",
            "Transparent"
        ]
    }
}

//Loop over Mics to Add to Page
Object.keys(mics).forEach(key => {
    createMic(key, mics[key]);
});

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
        <div class="micHead">
            <h4>${micName} <small>${micData.manufacturer}</small></h4>
            <div class="micType">
                <span>${micData.type}</span>
            </div>
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
                    <b>Frequency Response</b>
                    <span>
                        <span class="lowFreq">${micData.lowestFreq}</span>Hz - <span class="highFreq">${micData.highestFreq}</span>kHz
                    </span>
                </div>
                <div>
                    <b>Lending Level</b>
                    <span>
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
    `
    document.getElementById("gearList").innerHTML += toPush;
}   

let filters = {
    "type": ["SDC", "LDC"],
    "polar": ["Cardioid"],
    "lowFreq": 20,
    "highFreq": 12,
    "spl": 120,
    "uses": ["Electric Guitar"],
    "chars": ["Bright"],
    "level": [3,4]
};

let showMic = (mic) => {
    if(!mic.classList.contains("active")){
        mic.classList.add("active")
    }
}

let meetsConditions = (mic) => {
    if(mic.classList.contains("active")){
        mic.classList.remove("active")
    }
    if(filters.type){
        let thisType = mic.querySelector(".micType");
        if(!filters.type.some(t => thisType.textContent.includes(t))){
            return
        }
    }
    if(filters.polar){
        let thisType = mic.querySelector(".polarList");
        if(!filters.polar.some(t => thisType.textContent.includes(t))){
            return
        }
    }
    if(filters.lowFreq){
        let micFreq = parseInt(mic.querySelector(".lowFreq").innerHTML);
        if(micFreq > filters.lowFreq){
            return
        }
    }
    if(filters.highFreq){
        let micFreq = parseInt(mic.querySelector(".highFreq").innerHTML);
        if(micFreq < filters.highFreq){
            return
        }
    }
    if(filters.spl){
        let micSPL = parseInt(mic.querySelector(".maxSPL").innerHTML);
        if(micSPL < filters.spl){
            return
        }
    }
    if(filters.uses){
        let thisType = mic.querySelector(".usedOnUL");
        if(!filters.uses.some(t => thisType.textContent.includes(t))){
            return
        }
    }
    if(filters.chars){
        let thisType = mic.querySelector(".charUL");
        if(!filters.chars.some(t => thisType.textContent.includes(t))){
            return
        }
    }
    if(filters.level){
        let thisType = mic.querySelector(".charUL");
        if(!filters.chars.some(t => thisType.textContent.includes(t))){
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