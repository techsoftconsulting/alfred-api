import Collection from '../value-object/collection';
import ValueObject from '../value-object/value-object';
import { OrderBy } from './order-by';
import { OrderType } from './order-type';

interface OrderProps {
  orderBy: OrderBy;
  orderType: OrderType;
}

interface OrderPrimitiveProps {
  orderBy: string;
  orderType: string;
}

export default class Order extends ValueObject<OrderProps> {
  public static createDesc(orderBy: OrderBy): Order {
    return new Order({
      orderBy: orderBy,
      orderType: 'DESC',
    });
  }

  public static fromValues(orderBy: OrderBy, orderType: string): Order {
    return new Order({
      orderBy: orderBy,
      orderType: <OrderType>orderType,
    });
  }

  public static fromArray(orders: OrderPrimitiveProps[]) {
    return new Collection(
      orders.map((o) => Order.fromValues(o.orderType, o.orderBy)),
    );
  }

  /* public static none(): Order {
        return new Order({
            orderBy: '',
            orderType: "NONE",
        });
    } */

  public orderBy(): OrderBy {
    return this.props.orderBy;
  }

  public orderType(): OrderType {
    return this.props.orderType;
  }

  toPrimitives() {
    return `${this.props.orderType} ${this.props.orderBy}`;
  }
  /*   public isNone(): Boolean {
        return this.orderType().valueOf() === OrderType.NONE;
    }
 */
  /*  public  serialize(): string
    {
        return sprintf('%s.%s', this.orderBy.value(), this.orderType.value());
    } */
}
