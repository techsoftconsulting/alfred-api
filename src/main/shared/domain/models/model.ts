import { AnyObject, Options } from '../types';
import { ObjectUtils } from '../utils';

function asObject(value: any, options?: Options): any {
  if (value == null) return value;

  if (typeof value.toPrimitives === 'function') {
    return value.toPrimitives();
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      ObjectUtils.omitUnknown(asObject(item, options)),
    );
  }

  return value;
}

export default abstract class Model<T> {
  protected props: T;
  constructor(props: T) {
    this.props = props;
  }

  toJson(): AnyObject {
    return this.toObject();
  }

  toObject(options?: Options): Object {
    const obj: AnyObject = {};

    const props = this.props;
    const keys = Object.keys(props);
    keys.forEach((propertyName) => {
      const val = (props as AnyObject)[propertyName];
      obj[propertyName] = asObject(val, options);
    });

    return ObjectUtils.omitUnknown(obj);
  }

  toString(): string {
    return JSON.stringify(this.props);
  }
}
