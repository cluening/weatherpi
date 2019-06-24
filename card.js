/*
 *  Download a card's html
 */
function downloadCardHTML(id, url){
  var Httpreq = new XMLHttpRequest();

  console.log("Grabbing a card");

  Httpreq.id = id;
  Httpreq.onload = cardOnloadHandler;
  Httpreq.onerror = cardErrorHandler;
  Httpreq.ontimeout = cardTimeoutHandler;
  Httpreq.open("GET", url);
  Httpreq.send();
}

/*
 *  Onload handling callback for the HTTP request object
 */
function cardOnloadHandler(){
  if(this.readyState === 4){
    if(this.status === 200){
      console.log("Finished grabbing " + this.id);
			//contentDiv = document.getElementById("defaultscreen");
      contentDiv = document.getElementById(this.id);
      contentDiv.innerHTML = this.responseText;
    } else {
      console.error(this.statusText);
    }
  }
// FIXME: need a way to indicate that everything is loaded
  cardsloaded = true;
}

/*
 *  Error handling callback for the HTTP request object
 */
function cardErrorHandler(){
  // If the HTTP request fails, log the failure and try again in 15 minutes
  console.error("HTTP request failed.  " + this.statusText);
  updateWeatherDisplay();
  // FIXME: should probably try again or something
//  setTimeout(function(){updateWeather()}, 15*60*1000);
}

/*
 *  Timeout handling callback for the HTTP request object
 */
function cardTimeoutHandler(){
  // If the HTTP request times out, just try again in 15 minutes
  console.log("HTTP request timed out.  Trying again in 15 minutes.");
  updateWeatherDisplay();
  // FIXME: should probably try again or something
  //setTimeout(function(){updateWeather()}, 15*60*1000);
}

