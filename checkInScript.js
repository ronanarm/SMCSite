window.onload = () => {
    const queryString = window.location.search; 
    const urlParams = new URLSearchParams(queryString);
    const personID = urlParams.get('personID')

}
const checkIn = () => {
    const queryString = window.location.search; 
    const urlParams = new URLSearchParams(queryString);
    const personID = urlParams.get('personID')

    
    console.log(getCookie("hasMarked"))
    if(getCookie("hasMarked") == "true"){
      let attendanceLogBanner = document.querySelector(".attendanceBlurb");
      attendanceLogBanner.innerHTML = `You have already marked yourself as present.`
      attendanceLogBanner.classList.add("wrong")
      return
    }

    

    let button = document.querySelector(".mainBtn")
    button.disabled = true;
    button.innerHTML = "Please Wait";
    button.classList.add("buttonDisabled")

    function distance(lon1, lat1, lon2, lat2) {
        var R = 6371; 
        var dLat = (lat2-lat1).toRad();  
        var dLon = (lon2-lon1).toRad(); 
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; 
        return d;
      }
      
      if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function() {
          return this * Math.PI / 180;
        }
      }
      console.log(new Date())
     //document.cookie = "BrowserUser=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC";


      window.navigator.geolocation.getCurrentPosition(function(pos) {
        console.log(pos); 
        button.innerHTML = "Calculating Position";
        //, 
        let distancetoRC = distance(pos.coords.longitude, pos.coords.latitude, -85.21229404568588, 41.12256011135039 )
        console.log(
            distancetoRC
            
        ); 
        button.innerHTML = `Distance is ${distancetoRC}`;

        if(distancetoRC < 0.15){
          let attendanceLogBanner = document.querySelector(".attendanceBlurb");
            console.log("Person in Radius")
              //call AirTable API
              var Airtable = require('airtable');
              var base = new Airtable({apiKey: urlParams.get("ak")}).base('appVKJR76lWZ1teWE');
              base('Test Table for Class').update([{
                  "id": personID,
                  "fields": {
                    "Status": "Present"
                  }
                }], (err) => {
                if (err) {
                  console.error(err);
                  attendanceLogBanner.innerHTML = `We experienced an error attempting to mark you as present. Please report this to Ronan Armstrong, and include the following error: ${err}`
                attendanceLogBanner.classList.add("wrong")
                  return;
                }
                var date = new Date()
              date.setDate(date.getDate() + 1);
              let gtmsDate = date.toGMTString();
              document.cookie = `hasMarked=true; expires=${gtmsDate}`;
              attendanceLogBanner.innerHTML = `We successfully marked you as present.`
              attendanceLogBanner.classList.add("right")
                
              });
        }
        if(distancetoRC >= 0.15){
            let attendanceLogBanner = document.querySelector(".attendanceBlurb");
            let distanceCalc = Math.ceil(distancetoRC)
            attendanceLogBanner.innerHTML = `We were unable to mark you as present because your distance was ${distanceCalc} kilometers away from the Music Center.`
            attendanceLogBanner.classList.add("wrong")

            }
        
      }, function(error) {
        if (error.code == error.PERMISSION_DENIED) {
          let attendanceLogBanner = document.querySelector(".attendanceBlurb");
            
            attendanceLogBanner.innerHTML = `Please allow location access to mark your attendance.`
            attendanceLogBanner.classList.add("wrong")
        }
          
      });
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}