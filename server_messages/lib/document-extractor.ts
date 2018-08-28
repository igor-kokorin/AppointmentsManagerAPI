import { PropertyCheckerFactory, ObjectHelper, CommonBaseType } from '../../utilities';

export interface FieldsExtractorOptions {
    fieldsToExtract: Set<string>;
    objToExtractFrom: any;
}

export class FieldsExtractor extends CommonBaseType<FieldsExtractorOptions> {
    constructor(opts: FieldsExtractorOptions) {
        super(opts);

        PropertyCheckerFactory(this.opts, 'fieldsToExtract').isPresent().isOfType(Set).isNotEmpty();
        PropertyCheckerFactory(this.opts, 'objToExtractFrom').isPresent().isObject().isNotEmpty();
    }

    public extract() {
        let objToExtractFrom = this.opts.objToExtractFrom;
        let fieldsToExtract = this.opts.fieldsToExtract;
        let result = {};

        for (let field of fieldsToExtract) {
            let propValue = ObjectHelper.getPropertyValue(objToExtractFrom, field);

            if (propValue) {
                ObjectHelper.setPropertyValue(result, field, propValue);
            }
        }

        return result;
    }
}