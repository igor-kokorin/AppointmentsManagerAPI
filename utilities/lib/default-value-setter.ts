export class DefaultValueSetter {
    static set<T, P extends keyof T, D extends T[P]>(obj: T, propertyName: P, defaultValue: D) {
        if ((typeof obj[propertyName] === 'undefined') || ((defaultValue !== null) && (obj[propertyName] === null))) {
            obj[propertyName] = defaultValue;
        }
    }
}