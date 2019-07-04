function WeeklyCard(){
  Card.call(this, "weeklyscreen", "weeklyforecast.html");

  this.autoclosems = 30*1000;
}


WeeklyCard.prototype = Object.create(Card.prototype);


WeeklyCard.prototype.onClick = function(){
  console.log("Handling a weekly screen click");
  clearTimeout(weeklyscreentimeout); // in case somebody clicks to close this screen
  document.getElementById("weeklyscreen").style.display = "none";
  document.getElementById("weatherscreen").style.WebkitFilter = "blur(0px)";
}


/*
 *  Reload the page when the reload button is pressed
 */
function reloadPage(event){
  console.log("Reloading the page");
  window.location.reload(true);
}


/*
 *  Display the settings screen when the settings button is pressed
 */
function displaySettingsScreen(event){
  event.stopPropagation();
  console.log("Displaying settings screen");
  clearTimeout(weeklyscreentimeout);
  document.getElementById("weeklyscreen").style.display = "none";
  document.getElementById("settingsscreen").style.display = "inline";
}


/*
 *  Update the card's info
 */
// Needs:
//   weather object
WeeklyCard.prototype.updateCard = function(data){
  document.getElementById("day1name").textContent = data['weather']['day1name'];
  document.getElementById("day2name").textContent = data['weather']['day2name'];
  document.getElementById("day3name").textContent = data['weather']['day3name'];

  document.getElementById("day1icon").className = data['weather']['day1icon'];
  document.getElementById("day2icon").className = data['weather']['day2icon'];
  document.getElementById("day3icon").className = data['weather']['day3icon'];

  document.getElementById("day1lowtemp").textContent = data['weather']['day1lowtemp'];
  document.getElementById("day1hightemp").textContent = data['weather']['day1hightemp'];
  document.getElementById("day2lowtemp").textContent = data['weather']['day2lowtemp'];
  document.getElementById("day2hightemp").textContent = data['weather']['day2hightemp'];
  document.getElementById("day3lowtemp").textContent = data['weather']['day3lowtemp'];
  document.getElementById("day3hightemp").textContent = data['weather']['day3hightemp'];

  document.getElementById("dailysummary").textContent = data['weather']['dailysummary'];
}
