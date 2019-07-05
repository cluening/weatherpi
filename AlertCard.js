function AlertCard(weeklycard){
  Card.call(this, "alertdescriptionscreen", "AlertCard.html");

  this.weeklycard = weeklycard;

  this.alerttitles = [];
  this.alertdescriptions = [];

  this.autoclosems = 30*1000;
  // FIXME: change this to "curalert" or "curdisplayalert" or something similar
  this.curalertdescription = 0;
}

AlertCard.prototype = Object.create(Card.prototype);


AlertCard.prototype.onClick = function(){
  // FIXME: need to stop using the global weather object
  // FIXME: get rid of alertdescriptionscreentimeout variable
  console.log("Handling an alert screen click");
  clearTimeout(this.closetimeout);
  console.log(this.onClick);
  if(weather["alerttitles"].length > this.curalertdescription + 1){
    this.curalertdescription += 1;
    this.show();
  }else{
    this.curalertdescription = 0;
    console.log("Hiding alert description screen.");
    this.weeklycard.show();
    this.hide();
  }
}


AlertCard.prototype.onCardShow = function(){
  console.log("AlertCard onCardShow callback");
    console.log("Showing alert " + this.curalertdescription);

  if(weather["alerttitles"].length > this.curalertdescription + 1){
    document.getElementById("alertdescriptionbar").textContent = weather['alerttitles'][this.curalertdescription];
    document.getElementById("alertdescription").innerHTML = weather['alertdescriptions'][this.curalertdescription];
  }
}


// Requires:
//   alertitles[]
//   alertdescriptions[]
// FIXME: should this just take the weather object like the other three ended up doing?
// FIXME: the html element IDs should somehow be namespaced by the class they belong to
AlertCard.prototype.updateCardData = function(data){
  console.log("Updating alert display");

  this.alerttitles = data["alerttitles"];
  this.alertdescriptions = data["alertdescriptions"];
}
