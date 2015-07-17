#!/usr/bin/env python

import sys
import json
import forecastio
import ConfigParser

weather = {}

config = ConfigParser.ConfigParser()
if len(config.read(["weatherpi.cfg", "/etc/weatherpi.cfg"])) > 1:
  sys.stderr.write("Could not load any config files\n")
  sys.exit(1)


api_key = config.get("Updater", "forecastioapikey")
lat = config.get("Updater", "lat")
lon = config.get("Updater", "lon")

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

currentweatherfile = open('/var/www/html/weatherpi/currentweather.json', 'r')
weatherprev = json.load(currentweatherfile)
currentweatherfile.close()

print "Had: %s" % weatherprev['temperature']

weather['summary'] = forecast.currently().summary
weather['temperature'] = "%0.0f" % round(forecast.currently().temperature)
weather['hightemp'] = "%0.0f" % round(forecast.daily().data[0].temperatureMax)
weather['lowtemp'] = "%0.0f" % round(forecast.daily().data[0].temperatureMin)

try:
  weather['icon'] = climacon[forecast.currently().icon]
except KeyError:
  weather['icon'] = 'climacon cloud refresh'

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

currentweatherfile = open('/var/www/html/weatherpi/currentweather.json', 'w')
json.dump(weather, currentweatherfile)
currentweatherfile.close()