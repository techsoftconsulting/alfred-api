import ValueObject from '../value-object/value-object';

/* class constructor properties */
export interface CurrencyProps {
  name: string;
  symbol: string;
}

/* class properties to represent plain data */
export interface CurrencyPrimitiveProps {
  name: string;
  symbol: string;
}

export default class Currency extends ValueObject<CurrencyProps> {
  get name() {
    return this.props.name;
  }

  get symbol() {
    return this.props.symbol;
  }

  static fromPrimitives(props: CurrencyPrimitiveProps) {
    return new Currency({
      name: props.name,
      symbol: props.symbol,
    });
  }

  toPrimitives(): CurrencyPrimitiveProps {
    const json: any = super.toJson();
    return json;
  }
}
