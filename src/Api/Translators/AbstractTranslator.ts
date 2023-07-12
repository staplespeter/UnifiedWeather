export default abstract class AbstractTranslator<T> implements UW.IDataSource {
    requestor: UW.IDataRequestor<T>;

    constructor(requestor: UW.IDataRequestor<T>) {
        this.requestor = requestor;
    }
 
    abstract get(): Promise<Array<UW.Data>>;
}