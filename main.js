var weather = {};
var daynight = "day";
var weeklyscreentimeout;

/*
 *  Kick off the initial time and weather updates.
 */
function onLoad(){
  weather['sunriseTime'] = 0;
  weather['sunsetTime'] = Number.MAX_VALUE;
  //weather['sunriseTime'] = 1437826098;
  //weather['sunsetTime'] = 1437877032;
  updateTimeDisplay();
  updateWeather();
}

/*
 *  Handle clicks on the screen
 */
function defaultscreenOnClick(){
  console.log("Showing the weekly screen.");
  //window.location.reload(true);
  document.getElementById("weeklyscreen").style.display = "inline";
  document.getElementById("defaultscreen").style.WebkitFilter = "blur(10px)";
  weeklyscreentimeout = setTimeout(weeklyscreenOnClick, 30*1000);
}

function weeklyscreenOnClick(){
  console.log("Hiding weekly screen.");
  clearTimeout(weeklyscreentimeout); // in case somebody clicks to close this screen
  document.getElementById("weeklyscreen").style.display = "none";
  document.getElementById("defaultscreen").style.WebkitFilter = "blur(0px)";
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
 *  Close settings screen when x button is clicked
 */
function closeSettingsScreen(event){
  event.stopPropagation();
  document.getElementById("settingsscreen").style.display = "none";
  document.getElementById("defaultscreen").style.WebkitFilter = "blur(0px)";
}

/*
 *  Close the weatherpi window
 */
function closeWeatherPi(event){
  console.log("Trying to close window");
  this.window.close();
}

/*
 *  Wrapper function that kicks off the weather update process
 */
function updateWeather(){
  var url = "currentweather.json";
  var Httpreq = new XMLHttpRequest();

  console.log("Grabbing a weather update");

  Httpreq.onload = weatherOnloadHandler;
  Httpreq.onerror = weatherErrorHandler;
  Httpreq.ontimeout = weatherTimeoutHandler;
  Httpreq.open("GET", url);
  Httpreq.send();
}

/*
 *  Onload handling callback for the HTTP request object
 */
function weatherOnloadHandler(){
  if(this.readyState === 4){
    if(this.status === 200){
      weather = JSON.parse(this.responseText);
      updateWeatherDisplay();
    } else {
      console.error(this.statusText);
    }
  }
  setTimeout(function(){updateWeather()}, 15*60*1000);
}

/*
 *  Error handling callback for the HTTP request object
 */
function weatherErrorHandler(){
  // If the HTTP request fails, log the failure and try again in 15 minutes
  console.error("HTTP request failed.  " + this.statusText);
  updateWeatherDisplay();
  setTimeout(function(){updateWeather()}, 15*60*1000);
}

/*
 *  Timeout handling callback for the HTTP request object
 */
function weatherTimeoutHandler(){
  // If the HTTP request times out, just try again in 15 minutes
  console.log("HTTP request timed out.  Trying again in 15 minutes.");
  updateWeatherDisplay();
  setTimeout(function(){updateWeather()}, 15*60*1000);
}

/*
 *  Update the weather part of the display
 */
function updateWeatherDisplay(){
  // Update the current conditions
  var staledataalert = "Last updated more than 2 hours ago";
  var iconspan = document.getElementById("icon");
  var temperaturespan = document.getElementById("temperature");
  var tempdelta = document.getElementById("tempdelta");
  var hightemp = document.getElementById("hightemp");
  var lowtemp = document.getElementById("lowtemp");
  var screen = document.getElementById("defaultscreen");
  var hourlysummary = document.getElementById("hourlysummary");
  var curtime = Math.floor(Date.now()/1000); // Convert from milliseconds
  //console.log("Time: " + curtime);
  
  //console.log("Difference: " + (curtime - weather['updatetime']));
  if(curtime - weather['updatetime'] > 60*60*2){
    //console.log("Adding update time message to alert stack");
    if(weather['alerts'].indexOf(staledataalert) < 0){
      weather['alerts'].unshift(staledataalert);
    }
  }
  if(weather['alerts'].length > 0){
    //console.log("Hey look, an alert!");
    document.getElementById("alertbar").textContent = weather['alerts'][0];
  } else {
    document.getElementById("alertbar").textContent = "";
  }
  
  iconspan.className = weather['icon'];
  temperaturespan.textContent = weather['temperature'];
  tempdelta.textContent = weather['tempdelta'];
  hightemp.textContent = weather['hightemp'];
  lowtemp.textContent = weather['lowtemp'];
  hourlysummary.textContent = weather['hourlysummary'];
  //console.log("Sunrisetime: " + weather['sunriseTime']);
  //console.log("Sunsettime: " + weather['sunsetTime']);
  
  // Update the weekly forecast
  document.getElementById("day1name").textContent = weather['day1name'];
  document.getElementById("day2name").textContent = weather['day2name'];
  document.getElementById("day3name").textContent = weather['day3name'];
  
  document.getElementById("day1icon").className = weather['day1icon'];
  document.getElementById("day2icon").className = weather['day2icon'];
  document.getElementById("day3icon").className = weather['day3icon'];
  
  document.getElementById("day1lowtemp").textContent = weather['day1lowtemp'];
  document.getElementById("day1hightemp").textContent = weather['day1hightemp'];
  document.getElementById("day2lowtemp").textContent = weather['day2lowtemp'];
  document.getElementById("day2hightemp").textContent = weather['day2hightemp'];
  document.getElementById("day3lowtemp").textContent = weather['day3lowtemp'];
  document.getElementById("day3hightemp").textContent = weather['day3hightemp'];
  
  document.getElementById("dailysummary").textContent = weather['dailysummary'];
}

/*
 *  Update the time part of the display
 */
function updateTimeDisplay(){
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
  var screen = document.getElementById("defaultscreen");

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

  setTimeout(function(){updateTimeDisplay()}, 500);
}

/*
 *  Calculate a background color based on start/end colors, number of time steps, and
 *  current step number.
 *  startcolor and endcolor are a string in the form "rgb(r, g, b)"
 */
function backgroundColor(startcolor, endcolor, timestep, numsteps){
  // FIXME: This function could use some major optimization
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
