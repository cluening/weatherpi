var weather = {};
var daynight = "day";

function onLoad(){
  weather['sunriseTime'] = 0;
  weather['sunsetTime'] = Number.MAX_VALUE;
  //weather['sunriseTime'] = 1437826098;
  //weather['sunsetTime'] = 1437877032;
  updateTime();
  updateWeather();
}

function updateWeather(){
  var url = "currentweather.json";
  var Httpreq = new XMLHttpRequest();

  Httpreq.onload = weatherOnloadHandler;
  Httpreq.onerror = weatherErrorHandler;
  Httpreq.ontimeout = weatherTimeoutHandler;
  Httpreq.open("GET", url);
  Httpreq.send();
}

function weatherOnloadHandler(){
  if(this.readyState === 4){
    if(this.status === 200){
      updateWeatherDisplay(this.responseText);
    } else {
      console.error(this.statusText);
    }
  }
}

function weatherErrorHandler(){
  console.error(this.statusText);
  setTimeout(function(){updateWeather()}, 15*60*1000);
}

function weatherTimeoutHandler(){
  setTimeout(function(){updateWeather()}, 15*60*1000);
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
  //console.log("Time: " + curtime);
  
  iconspan.className = weather['icon'];
  temperaturespan.textContent = weather['temperature'];
  tempdelta.textContent = weather['tempdelta'];
  hightemp.textContent = weather['hightemp'];
  lowtemp.textContent = weather['lowtemp'];
  hourlysummary.textContent = weather['hourlysummary'];
  //console.log("Sunrisetime: " + weather['sunriseTime']);
  //console.log("Sunsettime: " + weather['sunsetTime']);
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

  setTimeout(function(){updateTime()}, 500);
}

// FIXME: This function could use some major optimization
function backgroundColor(startcolor, endcolor, timestep, numsteps){
  /* Takes colors in the form rgb(r, g, b) */
  // From stackoverflow: getComputedStyle(timediv).color.match(/\d+/g)

  var startrgb = startcolor.match(/\d+/g).map( function( num ){ return parseInt( num, 10 ) } );
  var endrgb = endcolor.match(/\d+/g).map( function( num ){ return parseInt( num, 10 ) } );
  var currgb = [];
  
  //console.log(startrgb);
  //console.log(endrgb);
  //console.log(timestep);
  //console.log(numsteps);

  currgb[0] = ((endrgb[0] - startrgb[0]) / numsteps) * (timestep+1) + startrgb[0];
  currgb[1] = ((endrgb[1] - startrgb[1]) / numsteps) * (timestep+1) + startrgb[1];
  currgb[2] = ((endrgb[2] - startrgb[2]) / numsteps) * (timestep+1) + startrgb[2];
  
  newrgb = "rgb(" + Math.round(currgb[0]) + ", " + Math.round(currgb[1]) + ", " + Math.round(currgb[2]) + ")";
  //console.log("Doing color animation: " + newrgb);

  return(newrgb);
}
