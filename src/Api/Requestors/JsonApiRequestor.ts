import axios from "axios";

/**
 * Configurable HTTP GET request object.  T is the expected type of the response.
 */
export default class JsonApiRequestor<T> implements UW.IDataRequestor<T> {
    /** The configuration object */
    configuration: UW.DatasourceConfig;

    /**
     * Stores the configuration for the target HTTP endpoint.
     * @param {UW.DatasourceConfig} config - The configuration.
     */
    constructor(config: UW.DatasourceConfig) {
        this.configuration = config;
    }

    /**
     * Makes the HTTP request based on the supplied configuration.
     * @returns The data payload of the specified type T.
     */
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