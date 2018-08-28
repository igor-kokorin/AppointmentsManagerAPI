export class ObjectHelper {
    public static getPropertyValue(obj: any, prop: string) {
        return prop.split('.').reduce((prev, curr, i, arr) => {
            if (prev) {
                return prev[arr[i]];
            }
        }, obj);
    }

    public static setPropertyValue(obj: any, prop: string, value: any) {
        prop.split('.').reduce((prev, curr, i, arr) => {
            if (i < arr.length - 1) {
                if (!prev[arr[i]]) {
                    prev[arr[i]] = {};
                }

                return prev[arr[i]];
            } else {
                prev[arr[i]] = value;
            }
        }, obj);
    }

    public static removeProperty(obj: any, prop: string) {
        return prop.split('.').reduce((prev, curr, i, arr) => {
            if (prev) {
                if (i === (arr.length - 1)) {
                   delete prev[arr[i]];
                }
    
                return prev[arr[i]];
            }
        }, obj);
    }
}