import axios from "axios";
import * as https from 'https';

export default class OpenMeteo {
    static BASE_URL = 'https://api.open-meteo.com/';

    async get(params: UW.QueryParams): Promise<Array<UW.Data>> {
        let data = new Array<UW.Data>();

        try {
            const tzOptions = {
                method: 'GET',
                //TODO: change to use URL object
                url: 'http://api.timezonedb.com/v2.1/get-time-zone',
                params: {
                    key: 'JIUTI9LUXQ11',
                    format: 'json',
                    by: 'position',
                    lat: params.latitude.toFixed(6),
                    lng: params.longitude.toFixed(6)
                }
            };
            const tzResponse = (await axios.request(tzOptions)).data;
            //OpenMeteo does not recognise DST timezone abbreviations, except BST.  Need to get the non-DST if in DST period.
            //See https://github.com/open-meteo/open-meteo/issues/396.
            const timezone = tzResponse.dst === 1 ?
                (tzResponse.abbreviation === 'BST' ? tzResponse.abbreviation : tzResponse.nextAbbreviation) :
                tzResponse.abbreviation;

            const options = {
                method: 'GET',
                //TODO: change to use URL object
                url: OpenMeteo.BASE_URL + 'v1/forecast',
                params: {
                    latitude: params.latitude.toFixed(6),
                    longitude: params.longitude.toFixed(6),
                    hourly: 'temperature_2m,windspeed_10m,winddirection_10m,precipitation_probability',
                    forecast_days: params.days.toFixed(0),
                    windspeed_unit: 'mph',
                    timeformat: 'unixtime',
                    timezone: timezone
                },
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            };
            const response: UW.OpenMeteoResponse = (await axios.request(options)).data;
            const localTime = response.hourly.time.map(value => { return (new Date(value * 1000)).toISOString() });

            for (let x = 0; x < response.hourly.time.length; x++) {
                data.push({
                    latitude: response.latitude,
                    longitude: response.longitude,
                    //time is BST = GMT + 1, and the days start at time == 01:00, so time_epoch == 00:00 
                    utcTime: new Date(response.hourly.time[x] * 1000),
                    temperature: response.hourly.temperature_2m[x],
                    temperatureUnit: 'C',
                    windSpeed: response.hourly.windspeed_10m[x],
                    windspeedUnit: 'mph',
                    windDirection: response.hourly.winddirection_10m[x],
                    precipitationChance: response.hourly.precipitation_probability[x]
                });
            }
        }
        catch (err) {
            let logMessage: any = err;
            if (axios.isAxiosError(err)) {
                logMessage = 'HTTP Error: ' + err.code + ' - ' + err.message +
                    (err.response?.data?.error ? 
                        '; API Error: ' + err.response?.data?.reason :
                        '');
            }
            global.logger?.error(err);
            data = null;
        }

        return data;
    }
}