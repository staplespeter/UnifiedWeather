import ConfigurationManager from "./ConfigurationManager";
import DataSourceFactory from "./DatasourceFactory";
import AveragingOptimiser from "./Optimisers/AveragingOptimiser";
import UnifiedWeather from "./UnifiedWeather";

export default class Controller {
    configurationManager: ConfigurationManager;
    datasourceFactory: DataSourceFactory;
    optimiser: UW.IDataOptimiser;
    unifiedWeather: UnifiedWeather;

    constructor() {
        this.configurationManager = new ConfigurationManager();
        this.datasourceFactory = new DataSourceFactory();
        this.optimiser = new AveragingOptimiser();
        this.unifiedWeather = new UnifiedWeather(this.configurationManager, this.datasourceFactory, this.optimiser);
    }

    async init() {
        await this.unifiedWeather.init();
    }

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