#!/usr/bin/env python3

import sys
import json
import pyowm
import configparser
import time
import calendar
import datetime

weather = {}

config = configparser.ConfigParser()
if len(config.read(["/etc/weatherpi.cfg", "weatherpi.cfg"])) < 1:
  sys.stderr.write("Could not load any config files\n")
  sys.exit(1)

api_key = config.get("Updater", "owmapikey")
lat = config.get("Updater", "lat")
lon = config.get("Updater", "lon")

## Potential future user-friendly strings
# Hourly summary strings
# xxx throughout the day.
# xxx, becoming xxx(cloudy) later.
# xxx, with rain in the xxx(afternoon, evening).
# Chance of xxx(rain, snow, thunderstorms) in the xxx(aftenoon, evening)
# xxx

# Weekly summary strings
# Possible light rain today through saturday

weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

climacon = {
 "01d": "climacon sun",
 "01n": "climacon moon",
 "02d": "climacon cloud sun",
 "02n": "climacon cloud moon",
 "03d": "climacon cloud",
 "03n": "climacon cloud",
 "04d": "climacon cloud",
 "04n": "climacon cloud",
 "09d": "climacon showers sun",
 "09n": "climacon showers moon",
 "10d": "climacon rain",
 "10n": "climacon rain",
 "11d": "climacon lightning",
 "11n": "climacon lightning",
 "13d": "climacon snow",
 "13n": "climacon snow",
 "50d": "climacon fog",
 "50n": "climacon fog",
}

owm = pyowm.OWM(api_key)
mgr = owm.weather_manager()
forecast = mgr.one_call(lat=float(lat), lon=float(lon), units="imperial")

currentweatherfile = open(config.get("Updater", "currentweatherfile"), 'r')
weatherprev = json.load(currentweatherfile)
currentweatherfile.close()

#print("Had: %s" % weatherprev['temperature'])

# Add the time the weather was last updated
weather['updatetime'] = int(time.time())

# Add the current and high/low temperatures
weather['temperature'] = "{:0.0f}".format(
  round(float(
    forecast.current.temp["temp"]
  ))
)
weather['hightemp'] = "{:0.0f}".format(
  round(float(
    forecast.forecast_daily[0].temp["max"]
  ))
)
weather['lowtemp'] = "{:0.0f}".format(
  round(float(
    forecast.forecast_daily[0].temp["min"]
  ))
)

# Add sunrise/sunset time
weather['sunriseTime'] = forecast.current.sunrise_time()
weather['sunsetTime'] = forecast.current.sunset_time()

# Shown at the bottom of the main weather card
# "Partly cloudy throughout the day"
weather['hourlysummary'] = forecast.forecast_hourly[0].status

weather['day1hightemp'] = "{:0.0f}".format(round(forecast.forecast_daily[1].temp["max"]))
weather['day1lowtemp'] = "{:0.0f}".format(round(forecast.forecast_daily[1].temp["min"]))
weather['day1name'] = weekdays[forecast.forecast_daily[1].reference_time("date").isoweekday()]

weather['day2hightemp'] = "{:0.0f}".format(round(forecast.forecast_daily[2].temp["max"]))
weather['day2lowtemp'] = "{:0.0f}".format(round(forecast.forecast_daily[2].temp["min"]))
weather['day2name'] = weekdays[forecast.forecast_daily[2].reference_time("date").isoweekday()]

weather['day3hightemp'] = "{:0.0f}".format(round(forecast.forecast_daily[3].temp["max"]))
weather['day3lowtemp'] = "{:0.0f}".format(round(forecast.forecast_daily[3].temp["min"]))
weather['day3name'] = weekdays[forecast.forecast_daily[3].reference_time("date").isoweekday()]


# Shown at the bottom of the weekly card
# "Possible light rain on Monday through next Friday, ..."
#weather['dailysummary'] = forecast.forecast_daily[1].status

# Add weather alerts
weather['alerttitles'] = []
weather['alertdescriptions'] = []
if forecast.national_weather_alerts is not None:
  for alert in forecast.national_weather_alerts:
    weather['alerttitles'].append(alert.title)
    weather['alertdescriptions'].append(alert.description)

try:
  weather['icon'] = climacon[forecast.current.weather_icon_name]
except KeyError:
  weather['icon'] = 'climacon cloud refresh'
try:
  weather['day1icon'] = climacon[forecast.forecast_daily[1].weather_icon_name]
except KeyError:
  weather['day1icon'] = 'climacon cloud refresh'
try:
  weather['day2icon'] = climacon[forecast.forecast_daily[2].weather_icon_name]
except KeyError:
  weather['day2icon'] = 'climacon cloud refresh'
try:
  weather['day3icon'] = climacon[forecast.forecast_daily[3].weather_icon_name]
except KeyError:
  weather['day3icon'] = 'climacon cloud refresh'

if weather['temperature'] > weatherprev['temperature']:
  weather['tempdelta'] = "and rising"
elif weather['temperature'] < weatherprev['temperature']:
  weather['tempdelta'] = "and falling"
else:
  weather['tempdelta'] = ""
  
#print("Summary:     %s" % weather['summary'])
#print("Conditions:  %s" % weather['icon'])
#print("Temperature: %s" % weather['temperature'])

print(json.dumps(weather))

currentweatherfile = open(config.get("Updater", "currentweatherfile"), 'w')
json.dump(weather, currentweatherfile)
currentweatherfile.close()
