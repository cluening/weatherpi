function WeeklyCard(settingscard){
  Card.call(this, "WeeklyCard.card", "WeeklyCard.html");

  this.settingscard = settingscard;
  this.autoclosems = 30*1000;
}


WeeklyCard.prototype = Object.create(Card.prototype);


WeeklyCard.prototype.onClick = function(){
  console.log("Handling a weekly screen click");
  clearTimeout(this.closetimeout); // in case somebody clicks to close this screen
  this.hide();
}


WeeklyCard.prototype.onCardAdded = function(){
  var self = this;
  document.getElementById("WeeklyCard.settingsbutton").onclick = function(event){
    self.displaySettingsScreen(event);
  }
  document.getElementById("WeeklyCard.reloadbutton").onclick = function(event){
    self.reloadPage(event);
  }
}


/*
 *  Reload the page when the reload button is pressed
 */
WeeklyCard.prototype.reloadPage = function(event){
  console.log("Reloading the page");
  window.location.reload(true);
}


/*
 *  Display the settings screen when the settings button is pressed
 */
WeeklyCard.prototype.displaySettingsScreen = function(event){
  event.stopPropagation();
  console.log("Displaying settings screen");
  console.log(this);
  clearTimeout(this.closetimeout);
  this.hide();
  this.settingscard.show();
}


/*
 *  Update the card's info
 */
// Needs:
//   weather object
WeeklyCard.prototype.updateCardData = function(data){
  document.getElementById("WeeklyCard.day1name").textContent = data['weather']['day1name'];
  document.getElementById("WeeklyCard.day2name").textContent = data['weather']['day2name'];
  document.getElementById("WeeklyCard.day3name").textContent = data['weather']['day3name'];

  document.getElementById("WeeklyCard.day1icon").className = data['weather']['day1icon'];
  document.getElementById("WeeklyCard.day2icon").className = data['weather']['day2icon'];
  document.getElementById("WeeklyCard.day3icon").className = data['weather']['day3icon'];

  document.getElementById("WeeklyCard.day1lowtemp").textContent = data['weather']['day1lowtemp'];
  document.getElementById("WeeklyCard.day1hightemp").textContent = data['weather']['day1hightemp'];
  document.getElementById("WeeklyCard.day2lowtemp").textContent = data['weather']['day2lowtemp'];
  document.getElementById("WeeklyCard.day2hightemp").textContent = data['weather']['day2hightemp'];
  document.getElementById("WeeklyCard.day3lowtemp").textContent = data['weather']['day3lowtemp'];
  document.getElementById("WeeklyCard.day3hightemp").textContent = data['weather']['day3hightemp'];

  document.getElementById("WeeklyCard.dailysummary").textContent = data['weather']['dailysummary'];
}
