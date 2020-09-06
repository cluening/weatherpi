#!/usr/bin/env python3

import sys
import json
import configparser
import time
import calendar
import datetime
import requests
from climacons import climacons

weather = {}

config = configparser.ConfigParser()
if len(config.read(["/etc/weatherpi.cfg", "weatherpi.cfg"])) < 1:
  sys.stderr.write("Could not load any config files\n")
  sys.exit(1)

api_key = config.get("Updater", "hereapikey")
zipcode = config.get("Updater", "zipcode")

hereobsurl = "https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey={apikey}&product=observation&zipcode={zipcode}&metric=false".format(apikey=api_key, zipcode=zipcode)
hereasturl = "https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey={apikey}&product=forecast_astronomy&zipcode={zipcode}&metric=false".format(apikey=api_key, zipcode=zipcode)
here7dayurl = "https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey={apikey}&product=forecast_7days_simple&zipcode={zipcode}&metric=false".format(apikey=api_key, zipcode=zipcode)
herealerturl = "https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey={apikey}&product=nws_alerts&zipcode={zipcode}".format(apikey=api_key, zipcode=zipcode)

## Potential future user-friendly strings
# Hourly summary strings
# xxx throughout the day.
# xxx, becoming xxx(cloudy) later.
# xxx, with rain in the xxx(afternoon, evening).
# Chance of xxx(rain, snow, thunderstorms) in the xxx(aftenoon, evening)
# xxx

# Weekly summary strings
# Possible light rain today through saturday


response = requests.get(hereobsurl)
current = json.loads(response.text)

response = requests.get(hereasturl)
astro = json.loads(response.text)

response = requests.get(here7dayurl)
forecast = json.loads(response.text)

response = requests.get(herealerturl)
alerts = json.loads(response.text)

currentweatherfile = open(config.get("Updater", "currentweatherfile"), 'r')
weatherprev = json.load(currentweatherfile)
currentweatherfile.close()

#print("Had: %s" % weatherprev['temperature'])

# Add the time the weather was last updated
weather['updatetime'] = int(time.time())

# Add the current and high/low temperatures
weather['temperature'] = "{:0.0f}".format(
  round(float(
    current["observations"]["location"][0]["observation"][0]["temperature"]
  ))
)
weather['hightemp'] = "{:0.0f}".format(
  round(float(
    current["observations"]["location"][0]["observation"][0]["highTemperature"]
  ))
)
weather['lowtemp'] = "{:0.0f}".format(
  round(float(
    current["observations"]["location"][0]["observation"][0]["lowTemperature"]
  ))
)

# Add sunrise/sunset time
weather['sunriseTime'] = int(
  datetime.datetime.strptime(
    # "2020-09-06T00:00:00.000-06:00"
    astro["astronomy"]["astronomy"][0]["utcTime"][:10] + "-" + 
    # "7:24PM"
    astro["astronomy"]["astronomy"][0]["sunrise"].zfill(7),
    "%Y-%m-%d-%I:%M%p"
  ).timestamp())
weather['sunsetTime'] = int(
  datetime.datetime.strptime(
    # "2020-09-06T00:00:00.000-06:00"
    astro["astronomy"]["astronomy"][0]["utcTime"][:10] + "-" + 
    # "7:24PM"
    astro["astronomy"]["astronomy"][0]["sunset"].zfill(7),
    "%Y-%m-%d-%I:%M%p"
  ).timestamp())

# Shown at the bottom of the main weather card
# "Partly cloudy throughout the day"
weather['hourlysummary'] = forecast["dailyForecasts"]["forecastLocation"]["forecast"][0]["description"]

weather['day1hightemp'] = "{:0.0f}".format(round(float(forecast["dailyForecasts"]["forecastLocation"]["forecast"][0]["highTemperature"])))
weather['day1lowtemp'] = "{:0.0f}".format(round(float(forecast["dailyForecasts"]["forecastLocation"]["forecast"][0]["lowTemperature"])))
weather['day1name'] = forecast["dailyForecasts"]["forecastLocation"]["forecast"][0]["weekday"][:3]

weather['day2hightemp'] = "{:0.0f}".format(round(float(forecast["dailyForecasts"]["forecastLocation"]["forecast"][1]["highTemperature"])))
weather['day2lowtemp'] = "{:0.0f}".format(round(float(forecast["dailyForecasts"]["forecastLocation"]["forecast"][1]["lowTemperature"])))
weather['day2name'] = forecast["dailyForecasts"]["forecastLocation"]["forecast"][1]["weekday"][:3]

weather['day3hightemp'] = "{:0.0f}".format(round(float(forecast["dailyForecasts"]["forecastLocation"]["forecast"][2]["highTemperature"])))
weather['day3lowtemp'] = "{:0.0f}".format(round(float(forecast["dailyForecasts"]["forecastLocation"]["forecast"][2]["lowTemperature"])))
weather['day3name'] = forecast["dailyForecasts"]["forecastLocation"]["forecast"][2]["weekday"][:3]


# Shown at the bottom of the weekly card
# "Possible light rain on Monday through next Friday, ..."
#weather['dailysummary'] = forecast.daily().summary
weather['dailysummary'] = forecast["dailyForecasts"]["forecastLocation"]["forecast"][1]["description"]

# Add weather alerts
weather['alerttitles'] = []
weather['alertdescriptions'] = []
if "nwsAlerts" in alerts:
  if "watch" in alerts["nwsAlerts"]:
    for alert in alerts["nwsAlerts"]["watch"]:
      weather["alerttitles"].append(alert["description"])
      weather["alertdescriptions"].append(alert["message"])
  if "warn" in alerts["nwsAlerts"]:
    for alert in alerts["nwsAlerts"]["warn"]:
      weather["alerttitles"].append(alert["description"])
      weather["alertdescriptions"].append(alert["message"])

try:
  weather['icon'] = climacons[current["observations"]["location"][0]["observation"][0]["iconName"]]
except KeyError:
  weather['icon'] = 'climacon cloud refresh'

try:
  weather['day1icon'] = climacons[forecast["dailyForecasts"]["forecastLocation"]["forecast"][1]["iconName"]]
except KeyError:
  weather['day1icon'] = 'climacon cloud refresh'

try:
  weather['day2icon'] = climacons[forecast["dailyForecasts"]["forecastLocation"]["forecast"][2]["iconName"]]
except KeyError:
  weather['day2icon'] = 'climacon cloud refresh'

try:
  weather['day3icon'] = climacons[forecast["dailyForecasts"]["forecastLocation"]["forecast"][3]["iconName"]]
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
