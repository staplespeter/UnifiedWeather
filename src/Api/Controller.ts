import ConfigurationManager from "./ConfigurationManager";
import DataSourceFactory from "./DatasourceFactory";
import AveragingOptimiser from "./Optimisers/AveragingOptimiser";
import UnifiedWeather from "./UnifiedWeather";

/**
 * Builds the UW and gets data from it.
 */
export default class Controller {
    /** The configuration manager used to handle config files. */
    configurationManager: ConfigurationManager;
    /** The factory used to build data sources (requestors + translators) */
    datasourceFactory: DataSourceFactory;
    /** The data optimiser that combines the data from multiple sources into one. */
    optimiser: UW.IDataOptimiser;
    /** UW object that orchestrates the retrieval, translation and optimisation of weather data from multiple API sources. */
    unifiedWeather: UnifiedWeather;

    /**
     * Creates configuration manager, datasource factory, optimiser and the UW object.
     */
    constructor() {
        this.configurationManager = new ConfigurationManager();
        this.datasourceFactory = new DataSourceFactory();
        this.optimiser = new AveragingOptimiser();
        this.unifiedWeather = new UnifiedWeather(this.configurationManager, this.datasourceFactory, this.optimiser);
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