import * as _ from 'underscore';
import * as deepCopy from 'deep-copy';

export default function reshapeDataForMongoDb(data: any[]) {
    let result = (<any>deepCopy)(data);
    
    return _.map(
        result,
        (elem: any) => {
            elem._id = elem.id; 
            return _.omit(elem, 'id');
        }
    );
}