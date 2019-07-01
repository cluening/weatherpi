/*
 *  The card object
 */
function Card(cardname, cardhtml){
  this.name = cardname;
  this.html = cardhtml;
  this.isloaded = false;
  this.displayupdateinterval = 15*60*1000;

  this.div = document.createElement("div");
  this.div.id = this.name;
  this.div.className = "screen";
  if(this.onClick != undefined) {
    this.div.onclick = this.onClick;
  }

  this.downloadCardHTML();

  // Other variables and functions this object needs:
  // var displaytimeout
  // var divID (or should this just always be the card name?)
  // function updateCallback()
  // function show(), function hide()
}


/*
 * Override this function to have this card's display updated every
 * this.displayupdateinterval milliseconds
 */
Card.prototype.intervalUpdateDisplay = undefined;


/*
 * Override this function to handle card-wide click events
 */
Card.prototype.onClick = undefined;


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

  Httpreq.card = this;
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
      console.log("Finished grabbing " + this.card.div.id);
      console.log(this.card);
      contentDiv = document.getElementById(this.card.div.id);
      contentDiv = this.card.div;
      contentDiv.innerHTML = this.responseText;

      this.card.isloaded = true;
      if(this.card.intervalUpdateDisplay != undefined){
        setInterval(this.card.intervalUpdateDisplay, this.card.displayupdateinterval);
      }

    } else {
      console.error(this.statusText);
    }
  }
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

