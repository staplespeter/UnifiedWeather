import Controller from "../Controller";


describe('Controller to end tests', () => {
    it('can request data from APIs using a config', async () => {
        const controller = new Controller();
        await controller.init();
        const result = await controller.getUWData({
            //https://www.latlong.net/place/belfast-uk-2141.html
            latitude: "54.607868",
            longitude: "-5.926437",
            days: "7"
        });
        expect(result.weatherData.length).toEqual(1);
        expect(result.weatherData[0].latitude).toEqual(54.607868);
        expect(result.weatherData[0].longitude).toEqual(-5.926437);
        expect(result.weatherData[0].utcTime.valueOf()).toEqual(0);
        expect(result.weatherData[0].temperature.toFixed(4)).toEqual('11.0000');
        expect(result.weatherData[0].temperatureUnit).toEqual('C');
        expect(result.weatherData[0].windSpeed.toFixed(4)).toEqual('21.0000');
        expect(result.weatherData[0].windspeedUnit).toEqual('mph');
        expect(result.weatherData[0].windDirection.toFixed(4)).toEqual('91.0000');
        expect(result.weatherData[0].precipitationChance.toFixed(4)).toEqual('51.0000');
    })
});