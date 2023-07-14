import Criteria from '@shared/domain/criteria/criteria';
import { FindManyOptions } from 'typeorm';

export default class NestjsCriteriaConverter {
  static convert(criteria: Criteria): FindManyOptions {
    const criteriaData = criteria.toPrimitives();
    const order = criteriaData.order?.length > 0 ? criteriaData.order : [];

    // eslint-disable-next-line prefer-const
    let finalOrder = {};

    order.forEach((order) => {
      const pieces = order.split(' ');

      finalOrder[pieces[1]] = pieces[0];
    });

    return {
      where: criteriaData.filters,
      take: <number>criteriaData.limit,
      skip: criteriaData.offset,
      order: finalOrder,
    };
  }
}
