/* export default class Filters extends Collection<Filter<any>> {
    public static fromValues(
        values: Array<FilterPrimitiveProps<any>>,
    ): Filters {
        return new Filters(
            values.map((f: FilterPrimitiveProps<any>) =>
                Filter.fromValues<any>(f),
            ),
        );
    }

    public add(filter: Filter<any>): Filters {
        return new Filters([...this.items, filter]);
    }

    public filters(): Array<Filter<any>> {
        return this.items;
    }

   
}
 */

import ValueObject from '../value-object/value-object';
import {
  ArrayContains,
  Equal,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

export interface FiltersProps {
  filters: any;
}

export default class Filters extends ValueObject<FiltersProps> {
  get filters() {
    return this.props.filters;
  }

  public static fromValues(values: any): Filters {
    return new Filters({
      filters: values,
    });
  }

  public static fromArray(
    values: { field: string; operator: string; value: any }[],
  ): Filters {
    const operatorMap = {
      '!=': Not,
      '==': Equal,
      in: In,
      'array-contains': ArrayContains /*postgres*/,
      '>=': MoreThanOrEqual,
      '>': MoreThan,
      '<=': LessThanOrEqual,
      '<': LessThan,
    };

    const final = values.reduce((acc, current) => {
      const value = (() =>
        current.operator === 'array-contains'
          ? `{${current.value}}`
          : current.value)();

      return {
        ...acc,
        [current.field]:
          operatorMap[current.operator]?.(value) ?? operatorMap['=='](value),
      };
    }, {});

    return new Filters({
      filters: final,
    });
  }

  toPrimitives() {
    return this.props.filters;
  }
}
