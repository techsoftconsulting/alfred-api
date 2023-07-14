import Collection from '../value-object/collection';
import ValueObject from '../value-object/value-object';
import Filters from './filters';
import Order from './order';

interface CriteriaProperties {
  filters: Filters;
  order: Collection<Order>;
  offset?: number;
  limit?: number;
}

export default class Criteria extends ValueObject<CriteriaProperties> {
  /*  public hasFilters(): boolean {
          return this.props.filters.count() > 0;
      }
   */

  /*  public hasOrder(): boolean {
          return !this.props.order.isNone();
      }
   */
  public plainFilters(): Array<any> {
    return this.props.filters.filters();
  }

  public filters(): Filters {
    return this.props.filters;
  }

  public order(): Collection<Order> {
    return this.props.order;
  }

  public offset() {
    return this.props.offset;
  }

  public limit() {
    return this.props.limit;
  }

  public toPrimitives() {
    const order: string[] = this.props.order?.map((o: Order) => {
      const orderData = o.toPrimitives();
      return orderData;
    });
    return {
      filters: this.props.filters.toPrimitives(),
      order: order,
      offset: this.props.offset,
      limit: this.props.limit,
    };
  }

  public serialize(): string {
    return '';
    /* return sprintf(
                '%s~~%s~~%s~~%s',
                this.props.filters.serialize(),
                this.props.order.serialize(),
                this.props.offset,
                this.props.limit,
            ); */
  }
}
