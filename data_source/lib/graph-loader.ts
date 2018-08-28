import { GraphLoaderQuery, GraphLoaderQueryLoadOptions } from '../index';
import { PropertyCheckerFactory } from '../../utilities';

export interface GraphLoaderOptions {
    graphLoaderQuery: GraphLoaderQuery;
}

export class GraphLoader {
    public graphLoaderQuery: GraphLoaderQuery;

    constructor(opts: GraphLoaderOptions) {
        PropertyCheckerFactory(opts, 'graphLoaderQuery').isPresent();

        this.graphLoaderQuery = opts.graphLoaderQuery;
    }

    public load(opts: GraphLoaderQueryLoadOptions): Promise<any[]> {
        PropertyCheckerFactory(opts, 'userId').isPresent();
        PropertyCheckerFactory(opts, 'dataItems').isPresent().isOfType(Array).isNotEmpty();
        PropertyCheckerFactory(opts, 'relations').isPresent().isOfType(Array).isNotEmpty()

        return this.graphLoaderQuery.load(opts);
    }
}