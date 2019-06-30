function weeklyscreenCreate(){
  weeklyscreen = new Card("weeklyscreen", "weeklyforecast.html");
  weeklyscreen.div.onclick = weeklyscreenOnClick;
  
  return weeklyscreen;
}


function weeklyscreenOnClick(){
  console.log("Handling a weekly screen click");
  clearTimeout(weeklyscreentimeout); // in case somebody clicks to close this screen
  document.getElementById("weeklyscreen").style.display = "none";
  document.getElementById("weatherscreen").style.WebkitFilter = "blur(0px)";
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

