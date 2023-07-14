import ConfigurationManager from "./ConfigurationManager";
import DataSourceFactory from "./DatasourceFactory";
import OptimiserFactory from "./OptimiserFactory";
import UnifiedWeather from "./UnifiedWeather";

/**
 * Builds the UW and gets data from it.
 */
export default class Controller {
    unifiedWeather: UnifiedWeather;

    /**
     * Creates configuration manager, datasource factory, optimiser and the UW object.
     */
    constructor() {
        this.unifiedWeather = new UnifiedWeather(new ConfigurationManager(), new DataSourceFactory(), new OptimiserFactory());
    }

    /**
     * Initialises the UW object.
     */
    async init() {
        await this.unifiedWeather.init();
    }

    /**
     * Checks UW API request query params and gets the data from the UW object.
     * @param {UW.QueryParams} params - The UW API request params.
     * @returns {UW.Result} The result of the query - the data or an error message.
     */
    async getUWData(params: UW.QueryParams): Promise<UW.Result> {
        const result: UW.Result = {};

        try {
            if (!params.latitude || Number.parseFloat(params.latitude) < -90 || Number.parseFloat(params.latitude) > 90) {
                result.error = 'Invalid latitude';
            }
            else if (!params.longitude || Number.parseFloat(params.longitude) < -180 || Number.parseFloat(params.longitude) > 180) {
                result.error = 'Invalid longitude';
            }
            else if (params.days && (Number.parseFloat(params.days) < 1 || Number.parseFloat(params.days) > 14)) {
                result.error = 'Invalid days';
            }
            else {
                params.days = params.days ?? '7';
                result.weatherData = await this.unifiedWeather.get(params);
            }
        }
        catch (err) {
            global.logger?.error(err);
            result.error = (err as Error).message;
        }

        return result;
     }
}