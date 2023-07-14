namespace UW {
    type TemperatureUnit = "C" | "F";
    type WindspeedUnit = "kph" | "mph";
    type QueryParams = {
        latitude: string;
        longitude: string;
        days?: string;
        fields?: string;
        temperatureUnit?: TemperatureUnit;
        windspeedUnit?: WindspeedUnit;
    }
    /** The return data format of the UW API. */
    type Data = {
        [key: string]: number | Date | string;
        //floating point to 6dp
        latitude: number;
        //floating point to 6dp
        longitude: number;
        //format yyyy-mm-ddThh:mm:ss.zzz
        utcTime: Date;
        //floating point to 1dp
        temperature: number;
        temperatureUnit: TemperatureUnit;
        //floating point to 2dp
        windSpeed: number;
        windspeedUnit: WindspeedUnit;
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
    type UWConfig = {
        sources: DatasourceConfig[];
        optimiser: 'average',
        fields: string[];
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
        get(data: Array<Data[]>): Data[];
    }
    interface IDataTransformer {
        get(data: Data[]): Data[];
    }
}