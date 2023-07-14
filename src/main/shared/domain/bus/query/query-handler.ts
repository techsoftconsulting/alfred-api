import Query from './query';
import {QueryResponse} from './query-response';

export default interface QueryHandler {
    getQueryName(): string;
    handle(query: Query): void | Promise<QueryResponse>;
}
