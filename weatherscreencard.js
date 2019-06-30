function weatherscreenCreate(){
  weatherscreen = new Card("weatherscreen", "weather.html");
  weatherscreen.div.onclick = weatherscreenOnClick;

  updateTimeDisplay();

  return weatherscreen;
}

function weatherscreenOnClick(){
  console.log("Handling a weather screen click");
  //window.location.reload(true);
  if(weather["alerttitles"].length > 0){
    curalertdescription = 0;
    // FIXME: this needs to just display the alert screen and let it take care of itself
    document.getElementById("alertdescriptionbar").textContent = weather['alerttitles'][0];
    document.getElementById("alertdescription").innerHTML = weather['alertdescriptions'][0];
    document.getElementById("alertdescriptionscreen").style.display = "inline";
    alertdescriptionscreentimeout = setTimeout(alertdescriptionscreenOnClick, 30*1000);
  }else{
    document.getElementById("weeklyscreen").style.display = "inline";
    weeklyscreentimeout = setTimeout(weeklyscreenOnClick, 30*1000);
  }
  document.getElementById("weatherscreen").style.WebkitFilter = "blur(10px)";
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

  // FIXME: this check should be done before this function even gets called
  if(cardsloaded == true){
    timespan = document.getElementById("time");
    timespan.innerHTML = hours + ":" + minutes;
  }

  //console.log("Time: " + timestamp);
  //console.log("Sunrisetime: " + weather['sunriseTime']);
  //console.log("Sunsettime: " + weather['sunsetTime']);
  var screen = document.getElementById("weatherscreen");

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

