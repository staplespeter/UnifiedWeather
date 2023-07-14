import fs from 'fs/promises';
import template from 'just-template';

/**
 * Handles loading of configuration data and injects UW query params into the requestor 'system' params.
 */
export default class ConfigurationManager {
    /** The configurations loaded */
    configuration: UW.UWConfig = null;

    /**
     * Loads the configurations from the specified file.
     * @param {string} filePath - The path of the file.
     */
    async load(filePath: string) {
        let fileHandle: fs.FileHandle = null;
        try {
            fileHandle = await fs.open(filePath);
            if (fileHandle) {
                const data = await fs.readFile(fileHandle, 'ascii');
                this.configuration = JSON.parse(data);
            }
        }
        finally {
            if (fileHandle) {
                fileHandle.close();
            }
        }
    }

    /**
     * 
     * @param {string} name - Gets a configuration object by name.
     * @returns {UW.DatasourceConfig} The configurationobject.
     */
    get(name: string): UW.DatasourceConfig {
        const config = this.configuration.sources.find(c => {
            return c.name === name;
        });
        if (!config) {
            throw new Error('Unable to find datasource configuration entry ' + name);
        }

        return config;
    }

    /**
     * Injects the query parameters from the request to the UW API into the config,
     * adding those injected parameters to the requestor 'system' params. 
     * @param {UW.QueryParams} params - The query parameters to inject. 
     * @returns {UW.DatasourceConfig[]} The datasource configuration objects with the injected params.
     */
    injectUWApiParams(params: UW.QueryParams): UW.DatasourceConfig[] {
        this.configuration.sources.forEach(c => {
            Object.entries(c.params.uwApi).forEach(([key, value]) => {
                c.params.system[key] = template(value, params);
            });
        })
        
        return this.configuration.sources;
    }
}