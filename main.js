var weather = {};
var daynight = "day";

function onLoad(){
  weather['sunriseTime'] = 0;
  weather['sunsetTime'] = Number.MAX_VALUE;
//  weather['sunriseTime'] = 1437393876;
//  weather['sunsetTime'] = 1437445229;
  updateTime();
  updateWeather();
}

function updateWeather(){
  var url = "currentweather.json";
  var Httpreq = new XMLHttpRequest();

  Httpreq.onload = weatherHandler;
  Httpreq.open("GET", url);
  Httpreq.send();     
}

function weatherHandler(){
  updateWeatherDisplay(this.responseText);
}

function updateWeatherDisplay(weatherjson){
  weather = JSON.parse(weatherjson);
  var iconspan = document.getElementById("icon");
  var temperaturespan = document.getElementById("temperature");
  var tempdelta = document.getElementById("tempdelta");
  var hightemp = document.getElementById("hightemp");
  var lowtemp = document.getElementById("lowtemp");
  var screen = document.getElementById("screen");
  var hourlysummary = document.getElementById("hourlysummary");
  var curtime = Math.floor(Date.now()/1000); // Convert from milliseconds
  console.log("Time: " + curtime);
  
  iconspan.className = weather['icon'];
  temperaturespan.textContent = weather['temperature'];
  tempdelta.textContent = weather['tempdelta'];
  hightemp.textContent = weather['hightemp'];
  lowtemp.textContent = weather['lowtemp'];
  hourlysummary.textContent = weather['hourlysummary'];
  //screen.style.background = "radial-gradient(at top, #012F68, #000E3E)";
  console.log("Sunrisetime: " + weather['sunriseTime']);
  console.log("Sunsettime: " + weather['sunsetTime']);
  //if(curtime > weather['sunriseTime'] && curtime < weather['sunsetTime']){
  //  screen.style.backgroundColor = "#2567C8";  // Day
  //} else {
  //  screen.style.backgroundColor = "#000E3E";  // Night
  //}
  
  setTimeout(function(){updateWeather()}, 15*60*1000);
}

function updateTime(){
  var now = new Date();
  var timestamp = Date.parse(now)/1000;
  var hours = now.getHours();
  var minutes = now.getMinutes();
  //timestamp = 1437445229 + 1;
  
  if(minutes < 10){
    minutes = "0" + minutes;
  }
  if(hours == 0){
    hours = 12;
  } else if(hours > 12){
    hours = hours % 12;
  }
  
  timespan = document.getElementById("time");
  timespan.innerHTML = hours + ":" + minutes;
  
  //console.log("Time: " + timestamp);
  //console.log("Sunrisetime: " + weather['sunriseTime']);
  //console.log("Sunsettime: " + weather['sunsetTime']);
  var screen = document.getElementById("screen");

/*
  if(timestamp > weather['sunriseTime'] && timestamp < weather['sunsetTime']){
    screen.style.backgroundColor = "#2567C8";  // Day
  } else {
    screen.style.backgroundColor = "#000E3E";  // Night
  }
*/

  if((timestamp > weather['sunriseTime'] - 3600 && timestamp < weather['sunsetTime']) && daynight == "night"){
    daynight = "day";
    console.log("Transitioning to day: " + timestamp + " (sunriseTime: " + weather['sunriseTime'] + ", sunsetTime: " + weather['sunsetTime']);
    if(timestamp < weather['sunriseTime'] - 1800){ // If the page is reloaded, only do the animation if it is still before sunriseish
      screen.style.animation = "nighttoday 3600s";
      console.log("Doing day animation: " + timestamp);
    }
    screen.style.backgroundColor = "#2567C8";
  }
  else if((timestamp < weather['sunriseTime'] - 3600 || timestamp > weather['sunsetTime']) && daynight == "day"){
    daynight = "night";
    console.log("Transitioning to night: " + timestamp);
    if(timestamp < weather['sunsetTime'] + 1800){ // If the page is reloaded, only do the animation if it is still before sunsetish
      screen.style.animation = "daytonight 3600s";
      console.log("Doing night animation: " + timestamp + " (sunriseTime: " + weather['sunriseTime'] + ", sunsetTime: " + weather['sunsetTime']);
    }
    screen.style.backgroundColor = "#000E3E";
  }
  
  setTimeout(function(){updateTime()}, 500);
}
