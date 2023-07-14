import Query from './query';

export type OrderData = {
    orderType: string;
    orderBy: string;
};

export default abstract class CriteriaQuery extends Query {
    constructor(
        public readonly filters: any,
        public readonly order: OrderData[],
        public readonly limit?: number,
        public readonly offset?: number,
    ) {
        super();
    }
}
