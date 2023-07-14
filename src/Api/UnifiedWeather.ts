import ConfigurationManager from './ConfigurationManager';
import DataSourceFactory from './DatasourceFactory';

export default class UnifiedWeather {
    configurationManager: ConfigurationManager;
    factory: DataSourceFactory;
    optimiser: UW.IDataOptimiser;
    sources: UW.IDataSource[];

    constructor(configManager: ConfigurationManager, factory: DataSourceFactory, optimiser: UW.IDataOptimiser) {
        this.configurationManager = configManager;
        this.factory = factory;
        this.optimiser = optimiser;
        this.sources = null;
    }

    async init() {
        await this.configurationManager.load('./config/sources.config.json');
        this.sources = this.factory.create(this.configurationManager);
        if (this.sources.length === 0) {
            throw new Error('No data sources found');
        }
    }

    async get(params: UW.QueryParams): Promise<UW.Data[]> {
        this.configurationManager.injectUWApiParams(params);
        
        const sourceData = new Array<UW.Data[]>();
        for (let s of this.sources) {
            sourceData.push(await s.get());
        };

        const result = this.optimiser.optimise(sourceData);
        return result;
    }
}