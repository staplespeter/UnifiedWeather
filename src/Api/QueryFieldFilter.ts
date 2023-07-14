/**
 * Filters fields based on their presence in the UW API query param 'fields'.
 * This param is a comma-separated list of valid field names.
 */
export default class QueryFieldFilter implements UW.IDataFieldFilter {
    fields: string[] = null;

    /**
     * Extracts the list of fields from the UW API query param 'fields'.
     * @param {UW.QueryParams} params - the API query params.
     */
    constructor(params: UW.QueryParams) {
        this.fields = params.fields?.split(',');
    }

    /**
     * Filters fields based on their presence in the UW API query param 'fields'.
     * @param {UW.Data[]} data - The data to filter.  The object is modified directly.
     */
    get(data: UW.Data[]): UW.Data[] {
        if (this.fields) {
            data.forEach(h => {
                Object.keys(h).forEach(k => {
                    if (!this.fields.includes(k)) {
                        delete h[k];
                    }
                })
            });
        }

        return data;
    }
}