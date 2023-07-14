/**
 * Filters fields based on their presence in the config file 'fields' property.
 */
import ConfigurationManager from "./ConfigurationManager";

export default class SystemFieldFilter implements UW.IDataTransformer {
    configurationManager: ConfigurationManager;

    /**
     * Stores the config manager.
     * @param {ConfigurationManager} configManager - the config manager.
     */
    constructor(configManager: ConfigurationManager) {
        this.configurationManager = configManager;
    }

    /**
     * Filters fields based on their presence in the config file 'fields' property.
     * @param {UW.Data[]} data - The data to filter.  The object is modified directly.
     */
    get(data: UW.Data[]): UW.Data[] {
        if (this.configurationManager.configuration.fields) {
            data.forEach(h => {
                Object.keys(h).forEach(k => {
                    if (!this.configurationManager.configuration.fields.includes(k)) {
                        delete h[k];
                    }
                })
            });
        }

        return data;
    }
}