/**
 * Astract class for subclasses that should take an object of type T and translate it to the UW data format.
 */
export default abstract class AbstractTranslator<T> implements UW.IDataSource {
    /** The requestor object that will provide the response. */
    requestor: UW.IDataRequestor<T>;

    /**
     * Stores the Requestor object.
     * @param requestor 
     */
    constructor(requestor: UW.IDataRequestor<T>) {
        this.requestor = requestor;
    }
 
    /**
     * Implementations of this should translate the response from the requestor to the UW data format.
     * Translators that receive data with undefined source fields must set the output fields to null.
     * This is required so that optimisers can ignore that value.
     * @returns The tranlated data.
     */
    abstract get(): Promise<Array<UW.Data>>;
}