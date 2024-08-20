let assetBody = document.querySelector(".assetContainer")

assets.forEach(asset => {
    let iInclude;
    switch ((asset.assetCategory)) {
      case "Session":
        iInclude = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.19 34.11">
        <g id="fqQYj5.tif">
          <g>
            <path class="cls-1" d="m0,16.39C1.26-4.53,31.03-5.85,34.05,14.89c.28,2.3.1,4.66-.53,6.89-.03.3.46.14.67.22-.67,1.55-1.36,3.1-2.05,4.65-.12.25-.44.11-.63.03-.21-.11-.29-.03-.41.13-2.97,4.31-7.86,6.91-13.06,7.27-5.86.31-11.67-2.5-14.99-7.36-.23-.25-.63.09-.92.09-.72-1.61-1.4-3.2-2.13-4.79,0-.01,0-.03,0-.04.24-.02.48-.04.71-.06C.33,20.47.05,19.07,0,17.58c.07-.38.07-.81,0-1.19Zm29.56,9.5c-3.04-1.67-5.41-4.24-7-7.3-1.32-2.19-2.55-5.18-5.23-5.91-3.77.37-5.02,5.6-7.11,8.2-1.46,2.11-3.31,3.8-5.58,5.03,5.9,8.43,19.07,8.47,24.92-.02ZM2.4,21.15c5.73-3.74,6.24-13.82,14.35-14.05,8.58-.43,9.24,10.15,15.06,14.07C35.87,7.78,19.87-4.39,7.7,4.92,2.07,9.34.89,16.24,2.4,21.15Z"/>
            <path class="cls-1" d="m0,17.89c.12,1.39.34,2.68.71,4.04-.23.02-.47.04-.71.06,0-1.37,0-2.73,0-4.1Z"/>
            <path class="cls-1" d="m0,16.39c.07.38.07.81,0,1.19,0-.4,0-.79,0-1.19Z"/>
          </g>
        </g>
      </svg>`;
        break;
      case "Web Resource":
        iInclude = `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"></path>
      </svg>`;
        break;
      case "Software":
        iInclude = `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"></path>
      </svg>`
      break;
      default:
        iInclude = "";
    }
    let htmlToPush = `
    <a class="assetBox active" href="${asset.assetURL}">
            <h3>${asset.assetName} ${iInclude}</h3>
            <span class="assetCategory">${asset.assetCategory}</span>
            <p>${asset.assetDescription}</p>
        </a>
        
    `
    assetBody.innerHTML += htmlToPush;
})

let updateFilters = (filterType, filterValue) => {
  if(filterType == "TextSearch"){
    filters[filterType] = [filterValue];
  }else{
    if(!filters[filterType]){
      filters[filterType] = [filterValue]
    }else if(filters[filterType].includes(filterValue)){
      filters[filterType] = filters[filterType].filter(item => item !== filterValue)
    }else{
      filters[filterType].push(filterValue)
    }
    if(filters[filterType].length < 1){
      delete filters[filterType]
    }
  }
  
  
  let assets = document.querySelectorAll(".assetBox");
  console.log(filters)

  if(Object.keys(filters).length < 1){
    assets.forEach(asset => show(asset))
  }else{
    assets.forEach(element => element.classList.remove("active"))
    assets.forEach(asset => showIfMatch(asset))
  }
  
}



let filters = {};

let showIfMatch = (asset) => {
  let shouldShow = true;
  for (const filterObj in filters) {
    if(filterObj === "Category"){
      console.log(filters[filterObj])
      if(!filters[filterObj].includes(asset.querySelector(`.asset${filterObj}`).innerHTML)){
        shouldShow = false
      }
    }
    if(filterObj == "TextSearch"){
      if(!asset.innerHTML.toLowerCase().includes(filters[filterObj][0].toLowerCase())){
        shouldShow = false
      }
    }
    
  }

  //If the asset contains text matching 
  if(shouldShow){
    asset.classList.add("active")
  }

}

let show = (asset) => {
  asset.classList.add("active")
}