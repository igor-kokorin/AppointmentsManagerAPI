
export interface RequestProcessorOptions {
    requestToQueryOptionsTransformer;
    query;
    responseGenerator;
}

export interface RequestProcessorProcessOptions {
    request: any;
    response: any;
}

export class RequestProcessor {
    constructor(opts: RequestProcessorOptions) {
    }

    public process(opts: RequestProcessorProcessOptions) {
    }
}