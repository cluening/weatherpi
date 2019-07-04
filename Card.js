/*
 *  The card object
 */
function Card(cardname, cardhtml){
  console.log("Creating new card");
  this.name = cardname;
  this.html = cardhtml;
  this.isloaded = false;
  this.displayupdatems = 15*60*1000;
  this.autoclosems = -1;

  this.div = document.createElement("div");
  this.div.id = this.name;
  this.div.className = "screen";
  // FIXME: this is now defined all the time
  if(this.onClick != undefined) {
    var self = this;
    this.div.onclick = function(){
      console.log(self.onClick);
      self.onClick();
    }
  }

  this.downloadCardHTML();

  // Other variables and functions this object needs:
  // var divID (or should this just always be the card name?)
  // function updateCallback()
  // function show(), function hide()
}


/*
 * Override this function to have this card's display updated every
 * this.displayupdatems milliseconds
 */
Card.prototype.intervalUpdateDisplay = undefined;


/*
 * Override this function to handle card-wide click events
 */
Card.prototype.onClick = function(){
  console.log("No onClick() defined");
}


/*
 * Override this function to update a card's data
 */
Card.prototype.updateCard = function(data){
  console.log("No updateDisplay() defined");
}


/*
 * Add a card to the document
*/
Card.prototype.addToDocument = function(){
  console.log("Adding div to the screen");
  document.body.appendChild(this.div);
}


/*
 * Show a card
 */
Card.prototype.show = function(){
  var self = this;
  this.div.style.display = "inline";
  if(this.autoclosems >= 0){
    console.log("Setting timeout");
    setTimeout(function(){
      self.hide();
    }, this.autoclosems);
  }
}


/*
 * Hide a card
 */
Card.prototype.hide = function(){
  console.log("Hiding");
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
      if(this.card.intervalUpdateDisplay != undefined){
        setInterval(this.card.intervalUpdateDisplay, this.card.displayupdatems);
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

