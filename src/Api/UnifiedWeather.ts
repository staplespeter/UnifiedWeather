import ConfigurationManager from './ConfigurationManager';
import OpenMeteo from './DataSources/OpenMeteo';
import WeatherApi from './DataSources/WeatherApi';
import DataSourceFactory from './DatasourceFactory';

export default class UnifiedWeather {
    configurationManager: ConfigurationManager;
    factory: DataSourceFactory;
    optimiser: UW.IDataOptimiser;
    sources: UW.IDataSource<UW.DataSourceResponse>[];

    constructor(configManager: ConfigurationManager, factory: DataSourceFactory, optimiser: UW.IDataOptimiser) {
        this.configurationManager = configManager;
        this.factory = factory;
        this.optimiser = optimiser;
        this.sources = new Array<UW.IDataSource<UW.DataSourceResponse>>();
    }

    async init() {
        await this.configurationManager.load('./config/sources.config.json');
        this.configurationManager.configurations.forEach(c => {
            const source = this.factory.create(c);
            if (source) { 
                this.sources.push(source);
            }
        });
    }

    async get(params: UW.QueryParams): Promise<UW.DataSourceResponse[]> {//<UW.Data[]> {
        //todo: change to UW.Data
        const sourceData = new Array<UW.DataSourceResponse>();
        for (let s of this.sources) {
            const config = this.configurationManager.injectUWApiParams(s.configuration.name, params);
            sourceData.push(await s.getResponse(config));
        };

        return sourceData;


        // const sources = new Array(2);
        // sources[0] = new OpenMeteo();
        // sources[1] = new WeatherApi();

        // const data = new Array<UW.Data[]>();
        // sources.forEach(async (source) => {
        //     data.push(await source.get(params));
        // });

        // const result = this.optimiser.optimise(data);

        // return result;
    }
}