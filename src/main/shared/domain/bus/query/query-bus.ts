import Query from './query';
import {QueryResponse} from './query-response';

export default interface QueryBus {
    ask(query: Query): Promise<QueryResponse>;
}
