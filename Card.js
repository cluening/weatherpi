/*
 *  The card object
 */
function Card(cardname){
  console.log("Creating new card");
  this.name = cardname;
  this.html = this.name + "/card.html";
  this.isloaded = false;
  this.autoclosems = -1;
  this.closetimeout = undefined;

  this.div = document.createElement("div");
  this.div.id = this.name + "-card";
  this.div.className = "Card";

  var self = this;
  this.div.onclick = function(){
    self.onClick();
  }

  this.downloadCardHTML();

}


/**
 ******************************************************
 **  Callbacks that can be overridden by subclasses  **
 ******************************************************
 **/
// FIXME: what other events should get callbacks?

/*
 * Called when the weather object has been updated
 * Override this function to do card work when new weather data is available
 */
Card.prototype.onWeatherUpdate = function(data){
  console.log("No onWeatherUpdate() defined");
}


/*
 * Called when a card is tapped
 * Override this function to handle card-wide click events
 */
Card.prototype.onClick = function(){
  console.log("No onClick() defined");
}


/*
 *  Called when showing a card
 *  Override to perform more actions as needed
 */
Card.prototype.onCardShow = function(){
  return;
}


/*
 * Called when a card's HTML has been loaded
 * Override to perform more actions as needed
 */
Card.prototype.onCardLoaded = function(){
  return;
}


/*
 * Called when a card is added to the document
 * Override to perform more actions as needed
 */ 
Card.prototype.onCardAdded = function(){
  return;
}

/**
 *********************
 **  End callbacks  **
 *********************
 **/


/*
 * Add a card to the document
*/
Card.prototype.addToDocument = function(){
  console.log("Adding div to the screen");
  document.body.appendChild(this.div);
  this.onCardAdded();
}


/*
 * Show a card
 */
Card.prototype.show = function(){
  var self = this;

  this.onCardShow();
  this.div.style.display = "inline";
  if(this.autoclosems >= 0){
    console.log("Setting timeout");
    this.closetimeout = setTimeout(function(){
      self.hide();
    }, this.autoclosems);
  }
}


/*
 * Hide a card
 */
Card.prototype.hide = function(){
  console.log("Hiding");
  console.log(this);
  clearTimeout(this.closetimeout);
  this.div.style.display = "none";
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
      this.card.onCardLoaded();
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

