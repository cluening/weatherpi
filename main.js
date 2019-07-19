var cardlist = [];
var weather = {};
var daynight = "day";

/*
 *  Create the cards and wait for them to finish loading
 */
function onLoad(){
  weather['sunriseTime'] = 0;
  weather['sunsetTime'] = Number.MAX_VALUE;
  //weather['sunriseTime'] = 1437826098;
  //weather['sunsetTime'] = 1437877032;

  // These should all probably live in the list (or a dict) eventually
  settingscard = new SettingsCard();
  weeklycard = new WeeklyCard(settingscard);
  alertcard = new AlertCard(weeklycard);
  weathercard = new WeatherCard(weeklycard, alertcard);

  cardlist.push(weeklycard);
  cardlist.push(alertcard);
  cardlist.push(settingscard);
  cardlist.push(weathercard);

  waitForLoaded();
}


/*
 * Wait for the cards to finish loading, then start the update loop
 */
function waitForLoaded(){
  for(i=0; i<cardlist.length; i++){
    if(cardlist[i].isloaded == false){
      console.log("Not loaded yet");
      setTimeout(waitForLoaded, 1000);
      return;
    }
  }
  // FIXME: add verbosity levels
  console.log("All cards loaded");
  weathercard.addToDocument();
  alertcard.addToDocument();
  settingscard.addToDocument();
  weeklycard.addToDocument();

  weathercard.show();

  updateWeather();
}


/*
 *  Wrapper function that kicks off the weather update process
 */
function updateWeather(){
  var url = "currentweather.json" + "?" + ((new Date()).getTime());
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
      console.log("Successfully grabbed weather update");
      weather = JSON.parse(this.responseText);
      onWeatherUpdate();
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
function onWeatherUpdate(){
  var staledataalert = "Last updated more than 2 hours ago";
  var staledatadescription = "<BR>Last weather update time:<BR>"; // Time and date get added later
  var curtime = Math.floor(Date.now()/1000); // Convert from milliseconds
  if(curtime - weather['updatetime'] > 60*60*2){
    //console.log("Adding update time message to alert stack");
    if(weather['alerttitles'].indexOf(staledataalert) < 0){
      updatedate = new Date(weather['updatetime'] * 1000);
      staledatadescription += updatedate;
      weather['alerttitles'].unshift(staledataalert);
      weather['alertdescriptions'].unshift(staledatadescription);
    }
  }

  // FIXME: should use the list of cards
  weathercard.onWeatherUpdate(
    {"weather": weather}
  );
  alertcard.onWeatherUpdate(
    {"weather": weather}
  );
  weeklycard.onWeatherUpdate(
    {"weather": weather}
  );
  settingscard.onWeatherUpdate(
    {"weather": weather}
  );
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
