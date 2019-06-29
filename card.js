/*
 *  The card object
 */
function Card(cardname, cardhtml){
  this.name = cardname;
  this.html = cardhtml;

  this.div = document.createElement("div");
  this.div.id = this.name;
  this.div.className = "screen";

  this.downloadCardHTML();

  // Other variables and functions this object needs:
  // function OnClick()
  // var displaytimeout
  // var divID (or should this just always be the card name?)
  // function updateCallback()
  // function show(), function hide()
}


// FIXME: this should probably all just move to the constructor
Card.prototype.addToDocument = function(){
  console.log("Adding div to the screen");
  document.body.appendChild(this.div);
}

/*
 *  Download a card's html
 */
Card.prototype.downloadCardHTML = function(){
  var Httpreq = new XMLHttpRequest();

  console.log("Grabbing a card object's data");

  Httpreq.id = this.name;
  Httpreq.div = this.div;
  Httpreq.onload = this.cardOnloadHandler;
  Httpreq.onerror = this.cardErrorHandler;
  Httpreq.ontimeout = this.cardTimeoutHandler;
  Httpreq.open("GET", this.html);
  Httpreq.send();
}

/*
 *  Onload handling callback for the HTTP request object
 */
Card.prototype.cardOnloadHandler = function(){
  if(this.readyState === 4){
    if(this.status === 200){
      console.log("Finished grabbing " + this.id);
      contentDiv = document.getElementById(this.id);
      contentDiv = this.div;
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
Card.prototype.cardErrorHandler = function(){
  // If the HTTP request fails, log the failure and try again in 15 minutes
  console.error("HTTP request failed.  " + this.statusText);
  updateWeatherDisplay();
  // FIXME: should probably try again or something
//  setTimeout(function(){updateWeather()}, 15*60*1000);
}

/*
 *  Timeout handling callback for the HTTP request object
 */
Card.prototype.cardTimeoutHandler = function(){
  // If the HTTP request times out, just try again in 15 minutes
  console.log("HTTP request timed out.  Trying again in 15 minutes.");
  updateWeatherDisplay();
  // FIXME: should probably try again or something
  //setTimeout(function(){updateWeather()}, 15*60*1000);
}

