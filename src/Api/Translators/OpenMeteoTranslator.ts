import AbstractTranslator from "./AbstractTranslator";

export default class OpenMeteoTranslator extends AbstractTranslator<UW.OpenMeteoResponse> {
    timezoneRequestor: UW.IDataRequestor<UW.TimeZoneDbResponse>;

    constructor(timezoneRequestor: UW.IDataRequestor<UW.TimeZoneDbResponse>, requestor: UW.IDataRequestor<UW.OpenMeteoResponse>) {
        super(requestor);
        this.timezoneRequestor = timezoneRequestor;
    }

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
                    latitude: dataResponse.latitude,
                    longitude: dataResponse.longitude,
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