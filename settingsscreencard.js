function SettingsCard(){
  Card.call(this, "settingsscreen", "settings.html");
}

SettingsCard.prototype = Object.create(Card.prototype);

/*
 *  Close settings screen when x button is clicked
 */
function closeSettingsScreen(event){
  event.stopPropagation();
  document.getElementById("settingsscreen").style.display = "none";
  document.getElementById("weatherscreen").style.WebkitFilter = "blur(0px)";
}


/*
 *  Close the weatherpi window
 */
function closeWeatherPi(event){
  console.log("Trying to close window");
  this.window.close();
}


SettingsCard.prototype.updateDisplay = function(){
  document.getElementById("lastupdatedate").textContent = Date(weather['updatetime']);
}