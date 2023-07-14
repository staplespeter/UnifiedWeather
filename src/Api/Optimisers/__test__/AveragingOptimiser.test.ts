import AveragingOptimiser from "../AveragingOptimiser";

describe('AveragingOptimiser tests', () => {
    it('Can average a set of weather data', () => {
        const data = new Array<UW.Data[]>(4)
        data[0] = [
            {
                latitude: 54.607868,
                longitude: -5.926437,
                utcTime: new Date(2023, 6, 1, 0, 0, 0),
                temperature: 5.4,
                temperatureUnit: 'C',
                windSpeed: 3.6,
                windspeedUnit: 'mph',
                windDirection: 45,
                precipitationChance: 2
            },
            {
                latitude: 54.607868,
                longitude: -5.926437,
                utcTime: new Date(2023, 6, 1, 1, 0, 0),
                temperature: 9.5,
                temperatureUnit: 'C',
                windSpeed: 2.4,
                windspeedUnit: 'mph',
                windDirection: 54,
                precipitationChance: 15
            },
        ];
        data[1] = [
            {
                latitude: 54.607868,
                longitude: -5.926437,
                utcTime: new Date(2023, 6, 1, 0, 0, 0),
                temperature: 6.2,
                temperatureUnit: 'C',
                windSpeed: 4,
                windspeedUnit: 'mph',
                windDirection: 38,
                precipitationChance: 8
            },
            {
                latitude: 54.607868,
                longitude: -5.926437,
                utcTime: new Date(2023, 6, 1, 1, 0, 0),
                temperature: 11.6,
                temperatureUnit: 'C',
                windSpeed: 1.7,
                windspeedUnit: 'mph',
                windDirection: 62,
                precipitationChance: 17
            },
        ];
        data[2] = [
            {
                latitude: 54.607868,
                longitude: -5.926437,
                utcTime: new Date(2023, 6, 1, 0, 0, 0),
                temperature: 7.1,
                temperatureUnit: 'C',
                windSpeed: 5.1,
                windspeedUnit: 'mph',
                windDirection: 46,
                precipitationChance: 0
            },
            {
                latitude: 54.607868,
                longitude: -5.926437,
                utcTime: new Date(2023, 6, 1, 1, 0, 0),
                temperature: 9.8,
                temperatureUnit: 'C',
                windSpeed: 6.5,
                windspeedUnit: 'mph',
                windDirection: 57,
                precipitationChance: 19
            },
        ];
        data[3] = [
            {
                latitude: 54.607868,
                longitude: -5.926437,
                utcTime: new Date(2023, 6, 1, 0, 0, 0),
                temperature: null,
                temperatureUnit: 'C',
                windSpeed: null,
                windspeedUnit: 'mph',
                windDirection: null,
                precipitationChance: null
            },
            {
                latitude: 54.607868,
                longitude: -5.926437,
                utcTime: new Date(2023, 6, 1, 1, 0, 0),
                temperature: null,
                temperatureUnit: 'C',
                windSpeed: null,
                windspeedUnit: 'mph',
                windDirection: null,
                precipitationChance: null
            },
        ];
        const result = new AveragingOptimiser().optimise(data);
        expect(result[0].latitude).toEqual(54.607868);
        expect(result[0].longitude).toEqual(-5.926437);
        expect(result[0].utcTime.valueOf()).toEqual((new Date(2023, 6, 1, 0, 0, 0)).valueOf());
        expect(result[0].temperature.toFixed(4)).toEqual('6.2333');
        expect(result[0].temperatureUnit).toEqual('C');
        expect(result[0].windSpeed.toFixed(4)).toEqual('4.2333');
        expect(result[0].windspeedUnit).toEqual('mph');
        expect(result[0].windDirection.toFixed(4)).toEqual('43.0000');
        expect(result[0].precipitationChance.toFixed(4)).toEqual('3.3333');
        expect(result[1].latitude).toEqual(54.607868);
        expect(result[1].longitude).toEqual(-5.926437);
        expect(result[1].utcTime.valueOf()).toEqual((new Date(2023, 6, 1, 1, 0, 0)).valueOf());
        expect(result[1].temperature.toFixed(4)).toEqual('10.3000');
        expect(result[1].temperatureUnit).toEqual('C');
        expect(result[1].windSpeed.toFixed(4)).toEqual('3.5333');
        expect(result[1].windspeedUnit).toEqual('mph');
        expect(result[1].windDirection.toFixed(4)).toEqual('57.6667');
        expect(result[1].precipitationChance.toFixed(4)).toEqual('17.0000');
    })
});