# UnifiedWeather
Demo weather aggregator

#To use
>install node & npm
>https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

>clone main branch

>node>npm install

>node>npm run deploy

go to

>http://localhost:25025/uw/

with query params

#Query params
>180 <= latitude <= 180

>90 <= longitude <= 90

>1 < days < 14

>temperatureUnit = C | F

>windspeedUnit = mph | kph

>fields = latitude,longitude,temperature,temperatureUnit,windSpeed,windspeedUnit,windDirection,precipitationChance

Example:
http://localhost:25025/uw/?latitude=54.607868&longitude=-5.926437&days=5&temperatureUnit=F&windspeedUnit=kph&fields=latitude,longitude,temperature,temperatureUnit,windSpeed

#Test
>node>npm run test
