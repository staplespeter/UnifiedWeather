import axios from "axios";

export default class JsonApiDatasource<T> implements UW.IDataSource<T> {
    configuration: UW.DatasourceConfig;

    constructor(config: UW.DatasourceConfig) {
        this.configuration = config;
    }

    async getResponse(config: UW.DatasourceConfig): Promise<T> {
        this.configuration = config;

        let response = null;
        try {
            const options = {
                method: 'GET',
                url: config.url.toString(),
                params: config.params.system
                //TODO: set httpsAgent?
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
            global.logger?.error(err);
        }

        return response;
    }

    get(params: UW.QueryParams): UW.Data[] {
        return;
    }
}