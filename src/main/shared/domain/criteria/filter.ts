import ValueObject from '../value-object/value-object';
import {FilterField} from './filter-field';
import {FilterOperator} from './filter-operator';
import FilterValue, {PrimitiveValue} from './filter-value';

export interface FilterProps<V extends PrimitiveValue> {
    field: FilterField;
    operator: FilterOperator;
    value: FilterValue<V>;
}

export interface FilterPrimitiveProps<T> {
    field: string;
    operator: FilterOperator;
    value: T;
}

export default class Filter<T extends PrimitiveValue> extends ValueObject<
    FilterProps<T>
> {
    public static fromValues<T extends PrimitiveValue>(
        values: FilterPrimitiveProps<T>,
    ): Filter<T> {
        return new Filter<T>({
            field: values.field,
            operator: values.operator,
            value: new FilterValue<T>(values.value),
        });
    }

    public field(): FilterField {
        return this.props.field;
    }

    public operator(): FilterOperator {
        return this.props.operator;
    }

    public value(): FilterValue<T> {
        return this.props.value;
    }

    public serialize(): string {
        return '';
        // return sprintf('%s.%s.%s', this.field->value(), this.operator->value(), this.value->value());
    }
}
