import axios from "axios";

export default class JsonApiRequestor<T> implements UW.IDataRequestor<T> {
    configuration: UW.DatasourceConfig;

    constructor(config: UW.DatasourceConfig) {
        this.configuration = config;
    }

    async get(): Promise<T> {
        let response = null;
        try {
            const options = {
                method: 'GET',
                url: this.configuration.url.toString(),
                params: this.configuration.params.system
            };
            response = (await axios.request(options)).data;
        }
        catch (err) {
            let logMessage: any = err;
            if (axios.isAxiosError(err)) {
                logMessage = 'HTTP Error: ' + err.code + ' - ' + err.message +
                    (err.response?.data?.error ? 
                        '; API Error: ' + err.response?.data?.reason :
                        '');
            }
            global.logger?.error(logMessage);
        }

        return response;
    }
}