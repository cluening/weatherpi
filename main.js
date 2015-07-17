function onLoad(){
  updateTime();
  updateWeather();
}

function updateWeather(){
  var url = "/weatherpi/currentweather.json";
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
  console.log("Got weather!" + weather['icon']);
  
  var iconspan = document.getElementById("icon");
  var temperaturespan = document.getElementById("temperature");
  var tempdelta = document.getElementById("tempdelta");
  var hightemp = document.getElementById("hightemp");
  var lowtemp = document.getElementById("lowtemp");
  
  iconspan.className = weather['icon'];
  temperaturespan.textContent = weather['temperature'];
  tempdelta.textContent = weather['tempdelta'];
  hightemp.textContent = weather['hightemp'];
  lowtemp.textContent = weather['lowtemp'];
  
  setTimeout(function(){updateWeather()}, 15*60*1000);
}

function updateTime(){
  var now = new Date();
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
  
  setTimeout(function(){updateTime()}, 500);
}