function AlertCard(){
  Card.call(this, "alertdescriptionscreen", "alert.html");

  this.alerttitles = [];
  this.alertdescriptions = [];
}

AlertCard.prototype = Object.create(Card.prototype);


AlertCard.prototype.onClick = function(){
  console.log("Handling an alert screen click");
  if(weather["alerttitles"].length > curalertdescription + 1){
    curalertdescription += 1;
    document.getElementById("alertdescriptionbar").textContent = weather['alerttitles'][curalertdescription];
    document.getElementById("alertdescription").innerHTML = weather['alertdescriptions'][curalertdescription];
    alertdescriptionscreentimeout = setTimeout(alertdescriptionscreenOnClick, 30*1000);
  }else{
    console.log("Hiding alert description screen.");
    clearTimeout(alertdescriptionscreentimeout); // in case somebody clicks to close this screen
    document.getElementById("alertdescriptionscreen").style.display = "none";
    document.getElementById("weeklyscreen").style.display = "inline";
    weeklyscreentimeout = setTimeout(weeklyscreenOnClick, 30*1000);
  }
}


AlertCard.prototype.updateCard = function(alerttitles, alertdescriptions){
  console.log("Updating alert display");
  
  this.alerttitles = alerttitles;
  this.alertdescriptions = alertdescrptions;

}


AlertCard.prototype.updateDisplay = function(){
  if(weather['alerttitles'].length > 0){
    document.getElementById("alertdescriptionbar").textContent = weather['alerttitles'][0];
  } else {
    document.getElementById("alertdescriptionbar").textContent = "";
  }
  // FIXME: this line is probably redundant after moving it to the alert screen click callback
  document.getElementById("alertdescription").innerHTML = weather['alertdescriptions'][0];
}
