namespace UW {
    type QueryParams = {
        latitude: string;
        longitude: string;
        days?: string;
    }
    /** The return data format of the UW API. */
    type Data = {
        //floating point to 6dp
        latitude: number;
        //floating point to 6dp
        longitude: number;
        //format yyyy-mm-ddThh:mm:ss.zzz
        utcTime: Date;
        //floating point to 1dp
        temperature: number;
        temperatureUnit: "C" | "F";
        //floating point to 2dp
        windSpeed: number;
        windspeedUnit: "km/h" | "mph" | "kn";
        //degrees, floating point to 2dp
        windDirection: number;
        //percentage
        precipitationChance: number;
    }
    type Result = {
        error?: string;
        weatherData?: Data[];
    }


    type DatasourceName = "WeatherAPI" | "OpenMeteo" | "TimeZoneDB";
    type DatasourceResponseFormat = "JSON" | "XML" | "CSV";
    type DatasourceSystemParams = {
        [key: string]: string;
    }
    type DatasourceUWApiParams = {
        [key: string]: keyof QueryParams;
    }
    type DatasourceParams = {
        system: DatasourceSystemParams;
        uwApi: DatasourceUWApiParams;
    }
    type DatasourceConfig = {
        name: DatasourceName;
        url: URL;
        format: DatasourceResponseFormat;
        params: DatasourceParams;
    }


    type WeatherApiResponseLocation = {
        lat: number;
        lon: number;
    }
    type WeatherApiResponseForecastHour = {
        time_epoch: number;
        temp_c: number;
        wind_mph: number;
        wind_degree: number;
        chance_of_rain: number;
    }
    type WeatherApiResponseForecastDay = {
        hour: Array<WeatherApiResponseForecastHour>;
    }
    type WeatherApiResponse = {
        location: WeatherApiResponseLocation;
        forecast: {
            forecastday: Array<WeatherApiResponseForecastDay>;
        }
    }

    type OpenMeteoResponseHourly = {
        time: number[];
        temperature_2m: number[];
        windspeed_10m: number[];
        winddirection_10m: number[];
        precipitation_probability: number[];
    }
    type OpenMeteoResponse = {
        latitude: number;
        longitude: number;
        hourly: OpenMeteoResponseHourly;
    }

    type TimeZoneDbResponse = {
        abbreviation: string;
        nextAbbreviation: string;
        dst: boolean;
    }

    type DatasourceResponse = WeatherApiResponse | OpenMeteoResponse | TimeZoneDbResponse;


    interface IDataRequestor<T> {
        configuration: DatasourceConfig;
        get(): Promise<T>;
    }
    interface IDataSource {
        requestor: IDataRequestor<T>;
        get(): Promise<Data[]>;
    }
    interface IDataOptimiser {
        optimise(data: Array<Data[]>): Data[];
    }
}