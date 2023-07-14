export type PrimitiveValue = Date | string | number | boolean;

export type Primitive = PrimitiveValue;

export default class FilterValue<T extends Primitive> {
    private value: T;

    constructor(value: T) {
        this.value = value;
    }

    get(): PrimitiveValue {
        return this.value;
    }
}
