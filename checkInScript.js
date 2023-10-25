window.onload = () => {
    const queryString = window.location.search; 
    const urlParams = new URLSearchParams(queryString);
    const person = urlParams.get('person')
    const personID = urlParams.get('personID')
    let personName = document.querySelector(".personName");
    personName.innerHTML = person
}
const checkIn = () => {
    const queryString = window.location.search; 
    const urlParams = new URLSearchParams(queryString);
    const person = urlParams.get('person')
    const personID = urlParams.get('personID')
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
        let distancetoRC = distance(pos.coords.longitude, pos.coords.latitude, -85.10847247405334, 41.11991550988574 )
        console.log(
            distancetoRC
        ); 
        if(distancetoRC < 0.15){
            console.log("Person in Radius")
        }
        if(distancetoRC >= 0.15){
            console.log("Person NOT in Radius")
            //call AirTable API
        }
      });
}