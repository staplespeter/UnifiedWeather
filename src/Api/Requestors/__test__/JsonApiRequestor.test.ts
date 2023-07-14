import JsonApiRequestor from "../JsonApiRequestor";

describe('JsonApiRequestor tests', () => {
    it('Can make a successful request to TimezoneDB', async () => {
        const config: UW.DatasourceConfig = {
            name: 'TimeZoneDB',
            url: new URL('http://api.timezonedb.com/v2.1/get-time-zone'),
            format: 'JSON',
            params: {
                system: {
                    lat: '0',
                    lng: '0'
                },
                uwApi: {}
            }
        }
        const requestor = new JsonApiRequestor<UW.TimeZoneDbResponse>(config);
        const response = await requestor.get();
        expect(response.abbreviation).toEqual('EDT');
        expect(response.nextAbbreviation).toEqual('EST');
        expect(response.dst).toEqual(true);
    });

    it('Can make a successful request to OpenMeteo', async () => {
        const config: UW.DatasourceConfig = {
            name: 'OpenMeteo',
            url: new URL('https://api.open-meteo.com/v1/forecast'),
            format: 'JSON',
            params: {
                system: {
                    latitude: '0',
                    longitude: '0'
                },
                uwApi: {}
            }
        }
        const requestor = new JsonApiRequestor<UW.OpenMeteoResponse>(config);
        const response = await requestor.get();
        expect(response.latitude).toEqual(0);
        expect(response.longitude).toEqual(0);
        expect(response.hourly.time.length).toEqual(1);
        expect(response.hourly.time[0]).toEqual(0);
        expect(response.hourly.temperature_2m[0]).toEqual(12);
        expect(response.hourly.windspeed_10m[0]).toEqual(22);
        expect(response.hourly.winddirection_10m[0]).toEqual(92);
        expect(response.hourly.precipitation_probability[0]).toEqual(52);
    });

    it('Can make a successful request to WeatherAPI', async () => {
        const config: UW.DatasourceConfig = {
            name: 'WeatherAPI',
            url: new URL('https://api.weatherapi.com/v1/forecast.json'),
            format: 'JSON',
            params: {
                system: {
                    q: '0,0'
                },
                uwApi: {}
            }
        }
        const requestor = new JsonApiRequestor<UW.WeatherApiResponse>(config);
        const response = await requestor.get();
        expect(response.location.lat).toEqual(0);
        expect(response.location.lon).toEqual(0);
        expect(response.forecast.forecastday.length).toEqual(1);
        expect(response.forecast.forecastday[0].hour.length).toEqual(1);
        expect(response.forecast.forecastday[0].hour[0].time_epoch).toEqual(0);
        expect(response.forecast.forecastday[0].hour[0].temp_c).toEqual(10);
        expect(response.forecast.forecastday[0].hour[0].wind_mph).toEqual(20);
        expect(response.forecast.forecastday[0].hour[0].wind_degree).toEqual(90);
        expect(response.forecast.forecastday[0].hour[0].chance_of_rain).toEqual(50);
    });

    it('Can handle an unsuccessful request', async () => {
        const config: UW.DatasourceConfig = {
            name: 'TimeZoneDB',
            url: new URL('http://api.timezonedb.com/v2.1/get-time-zone'),
            format: 'JSON',
            params: {
                system: {
                    lat: '-2',
                    lng: '-2'
                },
                uwApi: {}
            }
        }
        const requestor = new JsonApiRequestor<UW.TimeZoneDbResponse>(config);
        const response = await requestor.get();
        expect(response).toBeNull();
    });
});