function AlertCard(weeklycard){
  Card.call(this, "AlertCard");

  this.weeklycard = weeklycard;

  this.alerttitles = [];
  this.alertdescriptions = [];

  this.autoclosems = 30*1000;
  this.curalertindex = 0;
}

AlertCard.prototype = Object.create(Card.prototype);


AlertCard.prototype.onClick = function(){
  console.log("Handling an alert screen click");
  clearTimeout(this.closetimeout);
  console.log(this.onClick);
  if(this.alerttitles.length > this.curalertindex + 1){
    this.curalertindex += 1;
    this.show();
  }else{
    this.curalertindex = 0;
    console.log("Hiding alert description screen.");
    this.weeklycard.show();
    this.hide();
  }
}


AlertCard.prototype.onCardShow = function(){
  console.log("AlertCard onCardShow callback");
    console.log("Showing alert " + this.curalertindex);

  if(this.alerttitles.length > this.curalertindex){
    document.getElementById("AlertCard-alertdescriptionbar").textContent = this.alerttitles[this.curalertindex];
    document.getElementById("AlertCard-alertdescription").innerHTML = this.alertdescriptions[this.curalertindex];
  }
}


// Requires:
//   alertitles[]
//   alertdescriptions[]
// FIXME: should this just take the weather object like the other three ended up doing?
AlertCard.prototype.updateCardData = function(data){
  console.log("Updating alert display");

  this.alerttitles = data["alerttitles"];
  this.alertdescriptions = data["alertdescriptions"];
}
