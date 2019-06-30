function alertscreenCreate(){
  alertscreen = new Card("alertdescriptionscreen", "alert.html");
  alertscreen.div.onclick = alertdescriptionscreenOnClick;
  
  return alertscreen;
}


function alertdescriptionscreenOnClick(){
  console.log("Handling an alert screen click");
  if(weather["alerttitles"].length > curalertdescription + 1){
    curalertdescription += 1;
    document.getElementById("alertdescriptionbar").textContent = weather['alerttitles'][curalertdescription];
    document.getElementById("alertdescription").innerHTML = weather['alertdescriptions'][curalertdescription];
    alertdescriptionscreentimeout = setTimeout(alertdescriptionscreenOnClick, 30*1000);
  }else{
    console.log("Hiding alert description screen.");
    clearTimeout(alertdescriptionscreentimeout); // in case somebody clicks to close this screen
    document.getElementById("alertdescriptionscreen").style.display = "none";
    document.getElementById("weeklyscreen").style.display = "inline";
    weeklyscreentimeout = setTimeout(weeklyscreenOnClick, 30*1000);
  }
}

