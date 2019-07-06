function SettingsCard(){
  Card.call(this, "settingsscreen", "SettingsCard.html");
}

SettingsCard.prototype = Object.create(Card.prototype);

/*
 *  Close settings screen when x button is clicked
 */
function closeSettingsScreen(event){
  event.stopPropagation();
  document.getElementById("settingsscreen").style.display = "none";
}


/*
 *  Close the weatherpi window
 */
function closeWeatherPi(event){
  console.log("Trying to close window");
  this.window.close();
}


/*
 *  Update the card's info
 */
// Needs:
//   weather object
SettingsCard.prototype.updateCardData = function(data){
  document.getElementById("lastupdatedate").textContent = Date(data['weather']['updatetime']);
}
