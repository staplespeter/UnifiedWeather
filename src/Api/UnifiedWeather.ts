import OpenMeteo from './DataSources/OpenMeteo';
import WeatherApi from './DataSources/WeatherApi';
import DataSourceFactory from './DatasourceFactory';

export default class UnifiedWeather {
    factory: DataSourceFactory;
    sources: UW.IDataSource[];
    optimiser: UW.IDataOptimiser;

    constructor(factory: DataSourceFactory, optimiser: UW.IDataOptimiser) {
        this.factory = factory;
        this.optimiser = optimiser;
    }

    async get(params: UW.QueryParams): Promise<UW.Data[]> {
        this.sources = new Array(2);
        this.sources[0] = new OpenMeteo();
        this.sources[1] = new WeatherApi();

        const data = new Array<UW.Data[]>();
        this.sources.forEach(async (source) => {
            data.push(await source.get(params));
        });

        const result = this.optimiser.optimise(data);

        return result;
    }
}