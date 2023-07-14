import axios from "axios";
import * as https from 'https';


export default class WeatherApi {
    static BASE_URL = 'https://api.weatherapi.com/';

    async get(params: UW.QueryParams): Promise<Array<UW.Data>> {
        let data = new Array<UW.Data>();

        try {
            const options = {
                method: 'GET',
                url: WeatherApi.BASE_URL + 'v1/forecast.json',
                params: {
                  key: 'd652ae67e93f497f844231406231007',
                  q: params.latitude + ',' + params.longitude,
                  days: params.days
                },
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
              };
    
            const response: UW.WeatherApiResponse = (await axios.request(options)).data;
    
            response.forecast.forecastday.forEach((day: UW.WeatherApiResponseForecastDay) => {
                day.hour.forEach((hour: UW.WeatherApiResponseForecastHour) => {
                    data.push({
                        latitude: response.location.lat,
                        longitude: response.location.lon,
                        //time is BST = GMT + 1, and the days start at time == 00:00, so time_epoch == 23:00 
                        utcTime: new Date(hour.time_epoch * 1000),
                        temperature: hour.temp_c,
                        temperatureUnit: 'C',
                        windSpeed: hour.wind_mph,
                        windspeedUnit: 'mph',
                        windDirection: hour.wind_degree,
                        precipitationChance: hour.chance_of_rain
                    });
                });
            });
        }
        catch (err) {
            let logMessage: any = err;
            if (axios.isAxiosError(err)) {
                logMessage = 'HTTP Error: ' + err.code + ' - ' + err.message +
                    (err.response?.data?.error?.code ? 
                        '; API Error: ' + err.response?.data?.error?.code + ' - ' + err.response?.data?.error?.message :
                        '');
            }

            global.logger?.error(logMessage);
            data = null;
        }

        return data;
    }
}