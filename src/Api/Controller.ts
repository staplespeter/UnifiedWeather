import DataSourceFactory from "./DatasourceFactory";
import UnifiedWeather from "./UnifiedWeather";

export default class Controller {
    static async getUWData(params: UW.QueryParams): Promise<UW.Result> {
        const result: UW.Result = {};

        try {
            if (!params.latitude || params.latitude < -90 || params.latitude > 90) {
                result.error = 'Invalid latitude';
            }
            else if (!params.longitude || params.longitude < -180 || params.longitude > 180) {
                result.error = 'Invalid longitude';
            }            
            else {
                params.days = params.days ?? 7;
                result.data = await (new UnifiedWeather(null, null)).get(params);
            }
        }
        catch (err) {
            global.logger?.error(err);
            result.error = (err as Error).message;
        }

        return result;
     }
}