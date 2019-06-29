function weatherscreenCreate(){
  weatherscreen = new Card("weatherscreen", "weather.html");
  weatherscreen.div.onclick = weatherscreenOnClick;

  return weatherscreen;
}

function weatherscreenOnClick(){
  console.log("Showing the weekly screen.");
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
