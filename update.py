#!/usr/bin/env python3

import sys
import json
import configparser
import time
import calendar
import datetime
import requests


def day_from_timestamp(timestamp):
  daynames = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ]

  return daynames[datetime.datetime.fromtimestamp(timestamp).weekday()]


weather = {}

config = configparser.ConfigParser()
if len(config.read(["/etc/weatherpi.cfg", "weatherpi.cfg"])) < 1:
  sys.stderr.write("Could not load any config files\n")
  sys.exit(1)

api_key = config.get("Updater", "pirateweatherapikey")
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
  'clear-day': 'climacon sun',
  'clear-night': 'climacon moon',
  'rain': 'climacon rain',
  'snow': 'climacon snow',
  'sleet': 'climacon sleet',
  'wind': 'climacon wind',
  'fog': 'climacon fog',
  'cloudy': 'climacon cloud',
  'partly-cloudy-day': 'climacon cloud sun',
  'partly-cloudy-night': 'climacon cloud moon',
}

requestresult = requests.get(f"https://api.pirateweather.net/forecast/{api_key}/{lat},{lon}")
forecast = requestresult.json()

# FIXME: if the file doesn't exist yet, none of this works
currentweatherfile = open(config.get("Updater", "currentweatherfile"), 'r')
weatherprev = json.load(currentweatherfile)
currentweatherfile.close()

#print("Had: %s" % weatherprev['temperature'])

# Add the time the weather was last updated
weather['updatetime'] = int(time.time())

weather['summary'] = forecast["currently"]["summary"]
weather['temperature'] = "%0.0f" % round(forecast["currently"]["temperature"])
weather['hightemp'] = "%0.0f" % round(forecast["daily"]["data"][0]["temperatureMax"])
weather['lowtemp'] = "%0.0f" % round(forecast["daily"]["data"][0]["temperatureMin"])
weather['sunriseTime'] = forecast["daily"]["data"][0]["sunriseTime"]
weather['sunsetTime'] = forecast["daily"]["data"][0]["sunsetTime"]
weather['hourlysummary'] = forecast["hourly"]["summary"]

weather['day1hightemp'] = "%0.0f" % round(forecast["daily"]["data"][1]["temperatureMax"])
weather['day1lowtemp'] = "%0.0f" % round(forecast["daily"]["data"][1]["temperatureMin"])
weather['day1name'] = day_from_timestamp(forecast["daily"]["data"][1]["time"])

weather['day2hightemp'] = "%0.0f" % round(forecast["daily"]["data"][2]["temperatureMax"])
weather['day2lowtemp'] = "%0.0f" % round(forecast["daily"]["data"][2]["temperatureMin"])
weather['day2name'] = day_from_timestamp(forecast["daily"]["data"][2]["time"])

weather['day3hightemp'] = "%0.0f" % round(forecast["daily"]["data"][3]["temperatureMax"])
weather['day3lowtemp'] = "%0.0f" % round(forecast["daily"]["data"][3]["temperatureMin"])
weather['day3name'] = day_from_timestamp(forecast["daily"]["data"][3]["time"])

weather['dailysummary'] = forecast["daily"]["summary"]

# Add weather alerts
weather['alerttitles'] = []
weather['alertdescriptions'] = []
for alert in forecast["alerts"]:
  weather['alerttitles'].append(alert["title"])
  weather['alertdescriptions'].append(alert["description"])

try:
  weather['icon'] = climacon[forecast["currently"]["icon"]]
except KeyError:
  weather['icon'] = 'climacon cloud refresh'
try:
  weather['day1icon'] = climacon[forecast["daily"]["data"][1]["icon"]]
except KeyError:
  weather['day1icon'] = 'climacon cloud refresh'
try:
  weather['day2icon'] = climacon[forecast["daily"]["data"][2]["icon"]]
except KeyError:
  weather['day2icon'] = 'climacon cloud refresh'
try:
  weather['day3icon'] = climacon[forecast["daily"]["data"][3]["icon"]]
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
