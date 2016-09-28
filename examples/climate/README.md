## Test Data

The test data is downloaded from the NOAA Climate Data Online site: https://www.ncdc.noaa.gov/cdo-web/

The details of the data used is the 1981-2010 Normalized temperatures, pressures and wind speeds for Seattle, Washington USA.  This gives us some fun number series to graph!

Documentation for Header values:

```
cldd = cooling degree days
cldh = cooling degree hours
clod = clouds
dewp = dew point temperature
dutr = diurnal temperature range
hidx = heat index
htdd = heating degree days
htdh = heating degree hours
prcp = precipitation
pres = sea level pressure
snow = snowfall
snwd = snow depth
tavg = daily mean temperature (average of tmax and tmin)
temp = temperature
tmax = daily maximum temperature
tmin = daily minimum temperature
wchl = wind chill
wind = wind
```

The original header row was this:


```
STATION,STATION_NAME,ELEVATION,LATITUDE,LONGITUDE,DATE,HLY-CLDH-NORMAL,Completeness Flag,HLY-HTDH-NORMAL,Completeness Flag,HLY-PRES-NORMAL,Completeness Flag,HLY-CLOD-PCTOVC,Completeness Flag,HLY-DEWP-NORMAL,Completeness Flag,HLY-HIDX-NORMAL,Completeness Flag,HLY-TEMP-NORMAL,Completeness Flag,HLY-WCHL-NORMAL,Completeness Flag,HLY-WIND-AVGSPD,Completeness Flag,HLY-WIND-VCTDIR,Completeness Flag,HLY-WIND-VCTSPD,Completeness Flag
```

This was changed to be more ... human:

```
WeatherStation,WeatherStationName,Elevation,Latitude,Longitude,Time,CoolingDegreesNormal,CoolingDegreesNormalCompleted,HeatingDegreesNormal,HeatingDegreesNormalCompleted,Pressure,PressureCompleted,CloudCoverPercent,CloudCoverPercentCompleted,DewPoint,DewPointCompleted,HeatIndex,HeatIndexCompleted,Temperature,TemperatureCompleted,WindChill,WindChillCompleted,WindSpeed,WindSpeedCompleted,WindVector,WindVectorCompleted,WindVectorSpeed,WindVectorSpeedCompleted
```

A sample data row looks like this:

```
GHCND:USW00024233,SEATTLE TACOMA INTERNATIONAL AIRPORT WA US,112.8,47.44444,-122.31389,20100101 00:00,0.0,C,25.6,C,1.0,C,644,C,34.5,C,39.4,C,39.4,C,34.3,C,8.6,C,156,C,3.9,C
```

