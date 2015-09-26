#!/usr/bin/env python

import sys
import json
import forecastio
import ConfigParser
import time
import calendar
import datetime

weather = {}

config = ConfigParser.ConfigParser()
if len(config.read(["weatherpi.cfg", "/etc/weatherpi.cfg"])) > 1:
  sys.stderr.write("Could not load any config files\n")
  sys.exit(1)

api_key = config.get("Updater", "forecastioapikey")
lat = config.get("Updater", "lat")
lon = config.get("Updater", "lon")

weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

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

forecast = forecastio.load_forecast(api_key, lat, lon)

currentweatherfile = open(config.get("Updater", "currentweatherfile"), 'r')
weatherprev = json.load(currentweatherfile)
currentweatherfile.close()

print "Had: %s" % weatherprev['temperature']

weather['updatetime'] = int(time.time())
weather['summary'] = forecast.currently().summary
weather['temperature'] = "%0.0f" % round(forecast.currently().temperature)
weather['hightemp'] = "%0.0f" % round(forecast.daily().data[0].temperatureMax)
weather['lowtemp'] = "%0.0f" % round(forecast.daily().data[0].temperatureMin)
weather['sunriseTime'] = calendar.timegm(forecast.daily().data[0].sunriseTime.timetuple())  # FIXME: Is this really the most efficient way to do this conversion?
weather['sunsetTime'] = calendar.timegm(forecast.daily().data[0].sunsetTime.timetuple())
weather['hourlysummary'] = forecast.hourly().summary
weather['day1hightemp'] = "%0.0f" % round(forecast.daily().data[1].temperatureMax)
weather['day1lowtemp'] = "%0.0f" % round(forecast.daily().data[1].temperatureMin)
weather['day1name'] = weekdays[forecast.daily().data[1].time.weekday()]
weather['day2hightemp'] = "%0.0f" % round(forecast.daily().data[2].temperatureMax)
weather['day2lowtemp'] = "%0.0f" % round(forecast.daily().data[2].temperatureMin)
weather['day2name'] = weekdays[forecast.daily().data[2].time.weekday()]
weather['day3hightemp'] = "%0.0f" % round(forecast.daily().data[3].temperatureMax)
weather['day3lowtemp'] = "%0.0f" % round(forecast.daily().data[3].temperatureMin)
weather['day3name'] = weekdays[forecast.daily().data[3].time.weekday()]
weather['dailysummary'] = forecast.daily().summary

try:
  weather['icon'] = climacon[forecast.currently().icon]
except KeyError:
  weather['icon'] = 'climacon cloud refresh'
try:
  weather['day1icon'] = climacon[forecast.daily().data[1].icon]
except KeyError:
  weather['day1icon'] = 'climacon cloud refresh'
try:
  weather['day2icon'] = climacon[forecast.daily().data[2].icon]
except KeyError:
  weather['day2icon'] = 'climacon cloud refresh'
try:
  weather['day3icon'] = climacon[forecast.daily().data[3].icon]
except KeyError:
  weather['day3icon'] = 'climacon cloud refresh'

if weather['temperature'] > weatherprev['temperature']:
  weather['tempdelta'] = "and rising"
elif weather['temperature'] < weatherprev['temperature']:
  weather['tempdelta'] = "and falling"
else:
  weather['tempdelta'] = ""
  
print "Summary:     %s" % weather['summary']
print "Conditions:  %s" % weather['icon']
print "Temperature: %s" % weather['temperature']

print json.dumps(weather)

currentweatherfile = open(config.get("Updater", "currentweatherfile"), 'w')
json.dump(weather, currentweatherfile)
currentweatherfile.close()