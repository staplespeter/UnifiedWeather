import ConfigurationManager from './ConfigurationManager';
import DataSourceFactory from './DatasourceFactory';
import OptimiserFactory from './OptimiserFactory';
import QueryFieldFilter from './Filters/QueryFieldFilter';
import SystemFieldFilter from './Filters/SystemFieldFilter';
import UnitConverter from './Filters/UnitConverter';

/**
 * Orchestrates the retrieval, translation and optimisation of weather data from multiple API sources.
 */
export default class UnifiedWeather {
    /** ConfigurationManager storing the configs for each component */
    configurationManager: ConfigurationManager;
     /** The factory used to build data sources (requestors + translators) */
    datasourceFactory: DataSourceFactory;
    /** The factory used to get the optimiser */
    optimiserFactory: OptimiserFactory;
    /** Field filter to limit the response fields based on the config 'fields' entry */
    systemFieldFilter: UW.IDataTransformer;
    /** The sources that data is retreived from */
    sources: UW.IDataSource[];
    /** The data optimiser that combines the data from multiple sources into one. */
    optimiser: UW.IDataOptimiser;

    /**
     * Stores the ConfigurationManage, DataSourceFactory and IDataOptimiser
     * @param {ConfigurationManager} configManager - The confifg manager.
     * @param {DataSourceFactory} datasourceFactory - The datasource factory.
     * @param {OptimiserFactory} optimiserFactory - The optimiser.
     */
    constructor(configManager: ConfigurationManager, datasourceFactory: DataSourceFactory, optimiserFactory: OptimiserFactory) {
        this.configurationManager = configManager;
        this.datasourceFactory = datasourceFactory;
        this.optimiserFactory = optimiserFactory;
        this.systemFieldFilter = new SystemFieldFilter(this.configurationManager)
        this.sources = null;
    }

    /**
     * Loads the configurations from './config/sources.config.json'.  Throws an error if no sources can be found. 
     */
    async init() {
        await this.configurationManager.load('./config/sources.config.json');
        this.sources = this.datasourceFactory.create(this.configurationManager);
        if (this.sources.length === 0) {
            throw new Error('No data sources found');
        }
        this.optimiser = this.optimiserFactory.create(this.configurationManager);
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

        const unitFilter = new UnitConverter(params);
        const qFilter = new QueryFieldFilter(params);        
        return qFilter.get(this.systemFieldFilter.get(unitFilter.get(this.optimiser.get(sourceData))));
    }
}