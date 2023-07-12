import JsonApiDatasource from "./DataSources/JsonApiDatasource";

export default class DataSourceFactory {
    create(config: UW.DatasourceConfig): UW.IDataSource<UW.DataSourceResponse> {
        switch (config.name) {
            case 'OpenMeteo':
                return new JsonApiDatasource<UW.OpenMeteoResponse>(config);
            case 'WeatherAPI':
                return new JsonApiDatasource<UW.WeatherApiResponse>(config);
            default:
                global.logger?.error('Configuration file source entry not supported for name ' + config.name);
                return null;
        }
    }
}