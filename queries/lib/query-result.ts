export class QueryResult {
    constructor(public success: boolean, public data: any) {
    }

    public static success(data: any): QueryResult {
        return new QueryResult(true, data);
    }

    public static failure(reason: any): QueryResult {
        return new QueryResult(false, reason);
    }
}