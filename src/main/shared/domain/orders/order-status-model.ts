import AggregateRoot from '@shared/domain/aggregate/aggregate-root';

export type StatusType =
    | 'PROCESSING'
    | 'SCHEDULED'
    | 'IN_BACK_ORDER'
    | 'NEED_MORE_INFO'
    | 'SENT';

/* class constructor properties */
export interface OrderStatusProps {
    type: StatusType;
    displayName?: string;
}

/* class properties to represent plain data */
export interface OrderStatusPrimitiveProps {
    type: string;
    displayName?: string;
}

const toCamel = (str) =>
    str.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('_', '').replace('-', ''),
    );

export default class OrderStatus extends AggregateRoot<OrderStatusProps> {
    get type() {
        return this.props.type;
    }

    public getType(format: 'camelCase' | 'default' = 'default'): string {
        if (format === 'camelCase') {
            return toCamel(this.props.type.toLocaleLowerCase());
        }

        return this.props.type;
    }

    get isPlaced() {
        return this.props.type === 'PROCESSING';
    }

    get isSent() {
        return this.props.type === 'SENT';
    }

    get orderNeedsMoreInfo() {
        return this.props.type === 'NEED_MORE_INFO';
    }

    static fromPrimitives(props: OrderStatusPrimitiveProps) {
        return new OrderStatus({
            ...props,
            type: <StatusType>props.type,
        });
    }

    isEqual(status: OrderStatus) {
        return this.type === status.type;
    }

    toPrimitives(): OrderStatusPrimitiveProps {
        const json: any = super.toJson();
        return json;
    }
}
