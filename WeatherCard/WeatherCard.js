function WeatherCard(detailcard, alertcard){
  Card.call(this, "WeatherCard-card", "WeatherCard/Card.html");

  this.displayupdatems = 500;
  this.detailcard = detailcard;
  this.alertcard = alertcard;
}

WeatherCard.prototype = Object.create(Card.prototype);


/*
 * Handle clicks
 */
WeatherCard.prototype.onClick = function(){
  console.log("Handling a weather screen click");

  if(this.alertcard.alerttitles.length > 0){
    this.alertcard.show();
  } else {
    this.detailcard.show();
  }
}


/*
 *  Update the time part of the display
 */
// FIXME: this function should probably just be private to this card, since nothing else needs something like it
WeatherCard.prototype.intervalUpdateDisplay = function(){
  var now = new Date();
  var timestamp = Date.parse(now)/1000;
  var hours = now.getHours();
  var minutes = now.getMinutes();

  if(minutes < 10){
    minutes = "0" + minutes;
  }
  if(hours == 0){
    hours = 12;
  } else if(hours > 12){
    hours = hours % 12;
  }

  timespan = document.getElementById("WeatherCard-time");
  try {
    timespan.innerHTML = hours + ":" + minutes;
  }
  catch(err){
    // Must not be loaded yet.  Let's try again on the next iteration
    // Slightly hacky.
    return;
  }

  //console.log("Time: " + timestamp);
  //console.log("Sunrisetime: " + weather['sunriseTime']);
  //console.log("Sunsettime: " + weather['sunsetTime']);
  var screen = document.getElementById("WeatherCard-card");
    
  if((timestamp > weather['sunriseTime'] - 3600 && timestamp < weather['sunsetTime']) && daynight != "day"){
    if(timestamp < weather['sunriseTime']){
      //console.log("Doing day transition");
      //screen.style.backgroundColor = backgroundColor("rgb(0, 14, 62)", "rgb(37, 103, 200)", weather['sunriseTime'] - timestamp, 3600);
      screen.style.backgroundColor = backgroundColor("rgb(0, 14, 62)", "rgb(37, 103, 200)", timestamp - (weather['sunriseTime'] - 3600), 3600);
    }
    else if(timestamp > weather['sunriseTime']){
      //console.log("Jumping straight ahead to day: " + timestamp);
      screen.style.backgroundColor = "rgb(37, 103, 200)";
      daynight = "day";
    }
  }
  else if(timestamp > weather['sunsetTime'] && daynight != "night"){
    //console.log(timestamp + " (sunriseTime: " + weather['sunriseTime'] + ", sunsetTime: " + weather['sunsetTime']);
    if(timestamp < weather['sunsetTime'] + 3600){
      //console.log("Doing night transition");
      screen.style.backgroundColor = backgroundColor("rgb(37, 103, 200)", "rgb(0, 14, 62)", timestamp - weather['sunsetTime'], 3600);
    }
    else if(timestamp > weather['sunsetTime'] + 3600){
      //console.log("Jumping straight ahead to night: " + timestamp);
      screen.style.backgroundColor = "rgb(0, 14, 62)";
      daynight = "night";
    }
  }
  else if(timestamp < weather['sunriseTime'] - 3600 && daynight != "night"){
    //console.log("Jumping straight ahead to before dawn: " + timestamp);
    screen.style.backgroundColor = "rgb(0, 14, 62)";
    daynight = "night";
  }

}


/*
 *  Update the card's info
 */
// Needs:
//   weather object
WeatherCard.prototype.updateCardData = function(data){
  var iconspan = document.getElementById("WeatherCard-icon");
  var temperaturespan = document.getElementById("WeatherCard-temperature");
  var tempdelta = document.getElementById("WeatherCard-tempdelta");
  var hightemp = document.getElementById("WeatherCard-hightemp");
  var lowtemp = document.getElementById("WeatherCard-lowtemp");
  var hourlysummary = document.getElementById("WeatherCard-hourlysummary");

  if(data['weather']['alerttitles'].length > 0){
    document.getElementById("WeatherCard-alertbar").textContent = data['weather']['alerttitles'][0];
  } else {
    document.getElementById("WeatherCard-alertbar").textContent = "";
  }

  iconspan.className = data['weather']['icon'];
  temperaturespan.textContent = data['weather']['temperature'];
  tempdelta.textContent = data['weather']['tempdelta'];
  hightemp.textContent = data['weather']['hightemp'];
  lowtemp.textContent = data['weather']['lowtemp'];
  hourlysummary.textContent = data['weather']['hourlysummary'];
}
