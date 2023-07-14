import { AxiosRequestConfig, AxiosResponse, AxiosHeaders, AxiosError, AxiosStatic } from "axios";


class AxiosMock {
    static async request<T = any, R = AxiosResponse<T, any>, D = any>(config: AxiosRequestConfig<D>): Promise<R> {
        if (config.url?.toLowerCase().includes('weatherapi')) {
            return AxiosMock.handleWeatherAPI(config) as R;
        }
        if (config.url?.toLowerCase().includes('timezonedb')) {
            return AxiosMock.handleTimezoneDb(config) as R;
        }
        if (config.url?.toLowerCase().includes('open-meteo')) {
            return AxiosMock.handleOpenMeteo(config) as R;
        }
        
        throw new AxiosError('Unknown mock request', 'ERR_BAD_REQUEST');
    }

    private static handleWeatherAPI(config: AxiosRequestConfig): AxiosResponse {
        if (config.params.q === '-1,-1') {
            throw new AxiosError('Invalid key', 'ERR_BAD_REQUEST');
        }
        
        const data: UW.WeatherApiResponse = {
            location: {
                lat: Number.parseFloat(config.params.q.split(',')[0]),
                lon: Number.parseFloat(config.params.q.split(',')[1])
            },
            forecast: {
                forecastday: [
                    {
                        hour: [
                            {
                                time_epoch: 0,
                                temp_c: 10,
                                wind_mph: 20,
                                wind_degree: 90,
                                chance_of_rain: 50
                            }
                        ]
                    }
                ]
            }
        };
        return {
            data: data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {
                headers: new AxiosHeaders()
            }
        }
    }

    private static handleTimezoneDb(config: AxiosRequestConfig): AxiosResponse {
        if (config.params.lat == '-2' && config.params.lng == '-2') {
            throw new AxiosError('Not authorised', 'ERR_BAD_REQUEST');
        }
        
        const data: UW.TimeZoneDbResponse = {
            abbreviation: 'EDT',
            nextAbbreviation: 'EST',
            dst: true
        };
        return {
            data: data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {
                headers: new AxiosHeaders()
            }
        }
    }

    private static handleOpenMeteo(config: AxiosRequestConfig): AxiosResponse {
        if (config.params.latitude == '-3' && config.params.longitude == '-3') {
            throw new AxiosError('Unknown user', 'ERR_BAD_REQUEST');
        }
        
        const data: UW.OpenMeteoResponse = {
            latitude: Number.parseFloat(config.params.latitude),
            longitude: Number.parseFloat(config.params.longitude),
            hourly: {
                time: [0],
                temperature_2m: [12],
                windspeed_10m: [22],
                winddirection_10m: [92],
                precipitation_probability: [52]
            }
        };
        return {
            data: data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {
                headers: new AxiosHeaders()
            }
        }
    }
}

const mockAxios = jest.createMockFromModule<AxiosStatic>('axios');
mockAxios.create = jest.fn(() => mockAxios);
mockAxios.request = AxiosMock.request;
export default mockAxios;