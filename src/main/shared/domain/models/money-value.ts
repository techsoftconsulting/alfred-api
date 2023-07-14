import ValueObject from '../value-object/value-object';
import Currency, {CurrencyPrimitiveProps} from './currency-model';

/* class constructor properties */
export interface MoneyProps {
    value: number;
    currency?: Currency;
}

/* class properties to represent plain data */
export interface MoneyPrimitiveProps {
    value: number;
    currency?: CurrencyPrimitiveProps;
}

export const DefaultCurrency = new Currency({
    name: 'ARS',
    symbol: '$',
});

export default class Money extends ValueObject<MoneyProps> {
    get value() {
        return this.props.value;
    }

    get currency() {
        return this.props.currency;
    }

    static create(props: MoneyProps) {
        return new Money({
            ...props,
            currency: props.currency ? props.currency : DefaultCurrency,
        });
    }

    static fromPrimitives(props: MoneyPrimitiveProps) {
        return new Money({
            value: props.value,
            currency: props.currency
                ? Currency.fromPrimitives(props.currency)
                : DefaultCurrency,
        });
    }

    toPrimitives(): MoneyPrimitiveProps {
        const json: any = super.toJson();
        return json;
    }
}
