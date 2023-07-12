import fs from 'fs/promises';
const interpolation = require('interpolate-json').interpolation;

export default class ConfigurationManager {
    configurations: UW.DatasourceConfig[] = null;
    sourceNames: string[] = null;

    async load(filePath: string) {
        this.sourceNames = new Array<string>();

        let fileHandle: fs.FileHandle = null;
        try {
            fileHandle = await fs.open(filePath);
            if (fileHandle) {
                const data = await fs.readFile(fileHandle, 'ascii');
                this.configurations = JSON.parse(data).sources;
                this.sourceNames = this.configurations.map(c => { return c.name });
            }
        }
        finally {
            if (fileHandle) {
                fileHandle.close();
            }
        }
    }

    get(name: string): UW.DatasourceConfig {
        const config = this.configurations.find(c => {
            return c.name === name;
        });
        if (!config) {
            throw new Error('Unable to find datasource configuration entry ' + name);
        }

        return config;
    }

    injectUWApiParams(name: string, params: UW.QueryParams): UW.DatasourceConfig {
        const config = this.get(name);

        Object.entries(config.params.uwApi).forEach(([key, value]) => {
            config.params.system[key] = interpolation.expand(value, params);
        });

        return config;
    }
}