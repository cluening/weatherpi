function SettingsCard(){
  Card.call(this, "settingsscreen", "SettingsCard.html");
}

SettingsCard.prototype = Object.create(Card.prototype);


/*
 * 
 */
SettingsCard.prototype.onCardAdded = function(){
  var self = this;
  document.getElementById("SettingsCard.closeweatherpi").onclick = function(event){
    self.closeWeatherPi(event);
  }
  document.getElementById("SettingsCard.settingsclose").onclick = function(event){
    self.closeSettingsScreen(event);
  }
}


/*
 *  Close settings screen when x button is clicked
 */
SettingsCard.prototype.closeSettingsScreen = function(event){
  event.stopPropagation();
  this.hide();
}


/*
 *  Close the weatherpi window
 */
SettingsCard.prototype.closeWeatherPi = function(event){
  console.log("Trying to close window");
  window.close();
}


/*
 *  Update the card's info
 */
// Needs:
//   weather object
SettingsCard.prototype.updateCardData = function(data){
  document.getElementById("SettingsCard.lastupdatedate").textContent = Date(data['weather']['updatetime']);
}
