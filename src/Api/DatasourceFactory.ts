import ConfigurationManager from "./ConfigurationManager";
import JsonApiRequestor from "./Requestors/JsonApiRequestor";
import OpenMeteoTranslator from "./Translators/OpenMeteoTranslator";
import WeatherApiTranslator from "./Translators/WeatherApiTranslator";

export default class DataSourceFactory {
    create(configManager: ConfigurationManager): UW.IDataSource[] {
        let sources = new Array<UW.IDataSource>();

        configManager.configurations.forEach(c => {
            switch (c.name) {
                case 'OpenMeteo':
                    sources.push(new OpenMeteoTranslator(
                        new JsonApiRequestor<UW.TimeZoneDbResponse>(configManager.get('TimeZoneDB')),
                        new JsonApiRequestor<UW.OpenMeteoResponse>(c)
                    ));
                case 'WeatherAPI':
                    sources.push(new WeatherApiTranslator(new JsonApiRequestor<UW.WeatherApiResponse>(c)));
                case 'TimeZoneDB':
                    break;
                default:
                    global.logger?.error('Configuration file source entry not supported for name ' + c.name);
            }
        });

        return sources;
    }
}