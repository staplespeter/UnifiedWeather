import ConfigurationManager from "./ConfigurationManager";
import JsonApiRequestor from "./Requestors/JsonApiRequestor";
import OpenMeteoTranslator from "./Translators/OpenMeteoTranslator";
import WeatherApiTranslator from "./Translators/WeatherApiTranslator";

/**
 * Creates data sources (translator + requestor) based on the supplied configurations.
 */
export default class DataSourceFactory {
    /**
     * Creates data sources (translator + requestor) based on the configurations in the ConfigurationManager.
     * @param {ConfigurationManager} configManager - The ConfigurationManager holding the configs.
     * @returns {UW.IDataSource[]} An array of datasources.
     */
    create(configManager: ConfigurationManager): UW.IDataSource[] {
        let sources = new Array<UW.IDataSource>();

        configManager.configuration.sources.forEach(c => {
            switch (c.name) {
                case 'OpenMeteo':
                    sources.push(new OpenMeteoTranslator(
                        new JsonApiRequestor<UW.TimeZoneDbResponse>(configManager.get('TimeZoneDB')),
                        new JsonApiRequestor<UW.OpenMeteoResponse>(c)
                    ));
                    break;
                case 'WeatherAPI':
                    sources.push(new WeatherApiTranslator(new JsonApiRequestor<UW.WeatherApiResponse>(c)));
                    break;
                case 'TimeZoneDB':
                    break;
                default:
                    global.logger?.error('Configuration file source entry not supported for name ' + c.name);
            }
        });

        return sources;
    }
}