import fs from 'fs/promises';
import template from 'just-template';


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

    injectUWApiParams(params: UW.QueryParams): UW.DatasourceConfig[] {
        this.configurations.forEach(c => {
            Object.entries(c.params.uwApi).forEach(([key, value]) => {
                c.params.system[key] = template(value, params);
            });
        })
        
        return this.configurations;
    }
}