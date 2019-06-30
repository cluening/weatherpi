var weather = {};
var daynight = "day";
var weeklyscreentimeout;
var curalertdescription = 0;
var cardsloaded = false;

/*
 *  Kick off the initial time and weather updates.
 */
function onLoad(){
  weather['sunriseTime'] = 0;
  weather['sunsetTime'] = Number.MAX_VALUE;
  //weather['sunriseTime'] = 1437826098;
  //weather['sunsetTime'] = 1437877032;

  weathercard = weatherscreenCreate();
  weathercard.addToDocument();

  alertcard = alertscreenCreate();
  alertcard.addToDocument();

  settingscard = settingsscreenCreate();
  settingscard.addToDocument();

  weeklycard = weeklyscreenCreate();
  weeklycard.addToDocument();

  weatherscreen.div.style.zIndex = "100";

//  weathercard = new Card("weatherscreen", "weather.html");
//  alertcard = new Card("alertdescriptionscreen", "alert.html");
//  settingscard = new Card("settingsscreen", "settings.html");
//  weeklycard = new Card("weeklyscreen", "weeklyforecast.html");

//  weathercard.downloadCardHTML();
//  alertcard.downloadCardHTML();
//  settingscard.downloadCardHTML();
//  weeklycard.downloadCardHTML();

//  updateTimeDisplay();
  updateWeather();
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
  var staledatadescription = "<BR>Last weather update time:<BR>"; // Time and date get added later
  var iconspan = document.getElementById("icon");
  var temperaturespan = document.getElementById("temperature");
  var tempdelta = document.getElementById("tempdelta");
  var hightemp = document.getElementById("hightemp");
  var lowtemp = document.getElementById("lowtemp");
  var screen = document.getElementById("weatherscreen");
  var hourlysummary = document.getElementById("hourlysummary");
  var curtime = Math.floor(Date.now()/1000); // Convert from milliseconds
  //console.log("Time: " + curtime);
  
  //console.log("Difference: " + (curtime - weather['updatetime']));
  if(curtime - weather['updatetime'] > 60*60*2){
    //console.log("Adding update time message to alert stack");
    if(weather['alerttitles'].indexOf(staledataalert) < 0){
      updatedate = new Date(weather['updatetime'] * 1000);
      staledatadescription += updatedate;
      weather['alerttitles'].unshift(staledataalert);
      weather['alertdescriptions'].unshift(staledatadescription);
    }
  }
  if(weather['alerttitles'].length > 0){
    //console.log("Hey look, an alert!");
    // FIXME: this is a mess of two different cards
    document.getElementById("alertbar").textContent = weather['alerttitles'][0];
    document.getElementById("alertdescriptionbar").textContent = weather['alerttitles'][0];
  } else {
    document.getElementById("alertbar").textContent = "";
    document.getElementById("alertdescriptionbar").textContent = "";
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
  
  document.getElementById("lastupdatedate").textContent = Date(weather['updatetime']);
  // FIXME: this line is probably redundant after moving it to the alert screen click callback
  document.getElementById("alertdescription").innerHTML = weather['alertdescriptions'][0];
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
