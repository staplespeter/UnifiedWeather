/**
 * Converts units in fields.
 */
export default class UnitConverter implements UW.IDataTransformer{
    /** The response temp unit */
    responseTemperatureUnit: UW.TemperatureUnit;
    /** The response windspeed unit */
    responseWindspeedUnit: UW.WindspeedUnit;

    /**
     * saves target response units
     * @param {UW.QueryParams} params the query parms with the target units 
     */
    constructor(params: UW.QueryParams) {
        this.responseTemperatureUnit = params.temperatureUnit;
        this.responseWindspeedUnit = params.windspeedUnit;
    }

    /**
     * Converts field units.
     * @param {UW.Data[]} data the data to convert 
     * @returns converted data
     */
    get(data: UW.Data[]): UW.Data[] {
        if (this.responseTemperatureUnit) {
            this.convertTemperatureFields(data);
        }
        if (this.responseWindspeedUnit) {
            this.convertWindspeedFields(data);
        }
        return data;
    }

    private convertTemperatureFields(data: UW.Data[]) {
        data.forEach(h => {
            if (this.responseTemperatureUnit === 'F') {
                h.temperature = ((h.temperature * 9) / 5 ) + 32;
                h.temperatureUnit = 'F';
           }
        });
    }

    private convertWindspeedFields(data: UW.Data[]) {
        data.forEach(h => {
            if (this.responseWindspeedUnit === 'kph') {
                h.windSpeed = h.windSpeed * 1.60934;
                h.windspeedUnit = 'kph';
           }
        });
    }
}
