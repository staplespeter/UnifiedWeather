import AbstractTranslator from "./AbstractTranslator";

/**
 * Translates the resopnse from WeatherAPI weather service API to the UW format.
 */
export default class WeatherApiTranslator extends AbstractTranslator<UW.WeatherApiResponse> {
    /**
     * Translates the response from the WeatherAPI API into the UW format.
     * @returns The WeatherAPI response in UW format.
     */
    async get(): Promise<Array<UW.Data>> {
        let data = new Array<UW.Data>();

        try {
            const dataResponse = await this.requestor.get();
    
            dataResponse.forecast.forecastday.forEach((day: UW.WeatherApiResponseForecastDay) => {
                day.hour.forEach((hour: UW.WeatherApiResponseForecastHour) => {
                    data.push({
                        latitude: Number.parseFloat(this.requestor.configuration.params.system.q.split(',')[0]),
                        longitude: Number.parseFloat(this.requestor.configuration.params.system.q.split(',')[1]),
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
            global.logger?.error(err);
            data = null;
        }

        return data;
    }
}