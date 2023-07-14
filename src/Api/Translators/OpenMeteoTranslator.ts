import AbstractTranslator from "./AbstractTranslator";

/**
 * Translates the resopnse from OpenMeteo weather service API to the UW format.
 */
export default class OpenMeteoTranslator extends AbstractTranslator<UW.OpenMeteoResponse> {
    timezoneRequestor: UW.IDataRequestor<UW.TimeZoneDbResponse>;

    /**
     * Stores the requestors.
     * @param {UW.IDataRequestor<UW.TimeZoneDbResponse>} timezoneRequestor - The OpenMeteo service requires the time zone abbreviation.
     * This must be obtained from a separate API.  Using timezonedb.com for this.  This is the requestor object that will return the timezone response.
     * @param {UW.IDataRequestor<UW.OpenMeteoResponse>} requestor - The requestor for querying the OpenMeteo API
     */
    constructor(timezoneRequestor: UW.IDataRequestor<UW.TimeZoneDbResponse>, requestor: UW.IDataRequestor<UW.OpenMeteoResponse>) {
        super(requestor);
        this.timezoneRequestor = timezoneRequestor;
    }

    /**
     * Translates the response from the OpenMeteo API into the UW format.
     * @returns The OpenMeteo response in UW format.
     */
    async get(): Promise<Array<UW.Data>> {
        let data = new Array<UW.Data>();

        try {
            const tzResponse = await this.timezoneRequestor.get();
            //OpenMeteo does not recognise DST timezone abbreviations, except BST.  Need to get the non-DST if in DST period.
            //See https://github.com/open-meteo/open-meteo/issues/396.
            const timezone = tzResponse.dst ?
                (tzResponse.abbreviation === 'BST' ? tzResponse.abbreviation : tzResponse.nextAbbreviation) :
                tzResponse.abbreviation;
            this.requestor.configuration.params.system.timezone = timezone;

            const dataResponse = await this.requestor.get();

            for (let x = 0; x < dataResponse.hourly.time.length; x++) {
                data.push({
                    latitude: Number.parseFloat(this.requestor.configuration.params.system.latitude),
                    longitude: Number.parseFloat(this.requestor.configuration.params.system.longitude),
                    utcTime: new Date(dataResponse.hourly.time[x] * 1000),
                    temperature: dataResponse.hourly.temperature_2m[x],
                    temperatureUnit: 'C',
                    windSpeed: dataResponse.hourly.windspeed_10m[x],
                    windspeedUnit: 'mph',
                    windDirection: dataResponse.hourly.winddirection_10m[x],
                    precipitationChance: dataResponse.hourly.precipitation_probability[x]
                });
            }
        }
        catch (err) {
            global.logger?.error(err);
            data = null;
        }

        return data;
    }
}