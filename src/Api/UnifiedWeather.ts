import ConfigurationManager from './ConfigurationManager';
import DataSourceFactory from './DatasourceFactory';

/**
 * Orchestrates the retrieval, translation and optimisation of weather data from multiple API sources.
 */
export default class UnifiedWeather {
    /** ConfigurationManager storing the configs for each component */
    configurationManager: ConfigurationManager;
     /** The factory used to build data sources (requestors + translators) */
    factory: DataSourceFactory;
    /** The data optimiser that combines the data from multiple sources into one. */
    optimiser: UW.IDataOptimiser;
    /** The sources that data is retreived from */
    sources: UW.IDataSource[];

    /**
     * Stores the ConfigurationManage, DataSourceFactory and IDataOptimiser
     * @param {ConfigurationManager} configManager - The confifg manager.
     * @param {DataSourceFactory} factory - The datasource factory.
     * @param {UW.IDataOptimiser} optimiser - The optimiser.
     */
    constructor(configManager: ConfigurationManager, factory: DataSourceFactory, optimiser: UW.IDataOptimiser) {
        this.configurationManager = configManager;
        this.factory = factory;
        this.optimiser = optimiser;
        this.sources = null;
    }

    /**
     * Loads the configurations from './config/sources.config.json'.  Throws an error if no sources can be found. 
     */
    async init() {
        await this.configurationManager.load('./config/sources.config.json');
        this.sources = this.factory.create(this.configurationManager);
        if (this.sources.length === 0) {
            throw new Error('No data sources found');
        }
    }

    /**
     * Retrieves the data from each source and optimises it
     * @param {UW.QueryParams} params - UW API query params to inject into the configurations.
     * @returns {UW.Data[]} The optmised weather data.
     */
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