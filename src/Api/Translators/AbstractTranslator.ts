export default abstract class AbstractTranslator<T> implements UW.IDataSource {
    requestor: UW.IDataRequestor<T>;

    constructor(requestor: UW.IDataRequestor<T>) {
        this.requestor = requestor;
    }
 
    //Translators that receive data with undefined source fields must set the output fields to null.
    //This is required so that optimisers can ignore that value. 
    abstract get(): Promise<Array<UW.Data>>;
}