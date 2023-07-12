namespace UW {
    type QueryParams = {
        latitude: number;
        longitude: number;
        days?: number;
    }
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
        data?: Data[];
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
    type OpenMeteoResponseHourlyUnits = {
        temperature_2m: string;
        windspeed_10m: string;
        winddirection_10m: string;
        precipitation_probability: string;
    }
    type OpenMeteoResponse = {
        latitude: number;
        longitude: number;
        hourly: OpenMeteoResponseHourly;
        hourly_units: OpenMeteoResponseHourlyUnits;  //needed??
    }


    interface IDataSource {
        get(params: QueryParams): Promise<Data[]>;
    }
    interface IDataOptimiser {
        optimise(data: Array<Data[]>): Data[];
    }
}