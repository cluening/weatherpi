function AlertCard(weeklycard){
  Card.call(this, "alertdescriptionscreen", "AlertCard.html");

  this.weeklycard = weeklycard;

  this.alerttitles = [];
  this.alertdescriptions = [];

  this.autoclosems = 30*1000;
  this.curalertdescription = 0;
}

AlertCard.prototype = Object.create(Card.prototype);


AlertCard.prototype.onClick = function(){
  // FIXME: need to stop using the global weather object
  // FIXME: get rid of alertdescriptionscreentimeout variable
  console.log("Handling an alert screen click");
  clearTimeout(this.closetimeout);
  this.show();
  console.log(this.onClick);
  if(weather["alerttitles"].length > this.curalertdescription + 1){
    console.log("Showing another alert");
    this.curalertdescription += 1;
    document.getElementById("alertdescriptionbar").textContent = weather['alerttitles'][this.curalertdescription];
    document.getElementById("alertdescription").innerHTML = weather['alertdescriptions'][this.curalertdescription];
    //alertdescriptionscreentimeout = setTimeout(alertdescriptionscreenOnClick, 30*1000);
  }else{
    this.curalertdescription = 0;
    console.log("Hiding alert description screen.");
    this.weeklycard.show();
    this.hide();
  }
}


// Requires:
//   alertitles[]
//   alertdescriptions[]
// FIXME: should this just take the weather object like the other three ended up doing?
// FIXME: the element IDs should somehow be namespaced by the class they belong to
AlertCard.prototype.updateCard = function(data){
  console.log("Updating alert display");

  this.alerttitles = data["alerttitles"];
  this.alertdescriptions = data["alertdescriptions"];

  if(weather['alerttitles'].length > 0){
    document.getElementById("alertdescriptionbar").textContent = weather['alerttitles'][0];
  } else {
    document.getElementById("alertdescriptionbar").textContent = "";
  }
  // FIXME: this line is probably redundant after moving it to the alert screen click callback
  document.getElementById("alertdescription").innerHTML = weather['alertdescriptions'][0];
}
