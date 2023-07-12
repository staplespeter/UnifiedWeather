import WeatherApi from "../WeatherApi";

describe('WeatherApi API tests', () => {
    it('can get the 7-day forecast for Belfast', async () => {
        const wa = new WeatherApi();
        const data = await wa.get({
            //https://www.latlong.net/place/belfast-uk-2141.html
            latitude: 54.607868,
            longitude: -5.926437,
            days: 7
        });
        expect(data.length).toEqual(7*24);
    });

    it('can get the 7-day forecast for New York', async () => {
        const wa = new WeatherApi();
        const data = await wa.get({
            //https://www.latlong.net/place/new-york-city-ny-usa-1848.html
            latitude: 40.730610,
            longitude: -73.935242,
            days: 7
        });
        expect(data.length).toEqual(7*24);
    });
});