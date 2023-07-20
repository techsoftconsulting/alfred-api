import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import AdminStatsRepository from '@admin/auth/domain/repositories/stats/admin-stats-repository';
import { ScreenEventsEntity } from '@screens/auth/infrastructure/persistance/typeorm/entities/screen-events-entity';
import Criteria from '@shared/domain/criteria/criteria';
import { getManager } from 'typeorm';
import { DateTimeUtils } from '@shared/domain/utils';

export default class AdminStatsInfrastructureCommandRepository
  extends TypeOrmRepository<ScreenEventsEntity>
  implements AdminStatsRepository
{
  static readonly bindingKey = 'AdminStatsRepository';

  getEntityClass(): any {
    return ScreenEventsEntity;
  }

  async mostSearchedMalls(criteria?: Criteria): Promise<any[]> {
    const entityManager = getManager();

    const finalFilters = criteria?.toPrimitives().filters;

    const EVENT = 'USER_SEARCHED_RESTAURANT';

    const FROM = finalFilters?.from
      ? DateTimeUtils.format(finalFilters.from, 'YYYY-MM-DD')
      : undefined;
    const TO = finalFilters?.to
      ? DateTimeUtils.format(finalFilters.to, 'YYYY-MM-DD')
      : undefined;

    const LIMIT = 10;

    const result = await entityManager.query(`
      SELECT
        data,
        COUNT(*) AS count
      FROM
        screen_events
      WHERE
        event = '${EVENT}'
       ${FROM && TO ? `AND occurred_on BETWEEN '${FROM}' AND '${TO}'` : ''}
      GROUP BY
        data#>>'{id}', data
      ORDER BY
        count DESC
      LIMIT ${LIMIT}`);

    return result;
  }

  async mostSearchedRestaurants(criteria?: Criteria): Promise<any[]> {
    const entityManager = getManager();

    const finalFilters = criteria?.toPrimitives().filters;

    const EVENT = 'USER_SEARCHED_RESTAURANT';

    const FROM = finalFilters?.from
      ? DateTimeUtils.format(finalFilters.from, 'YYYY-MM-DD')
      : undefined;
    const TO = finalFilters?.to
      ? DateTimeUtils.format(finalFilters.to, 'YYYY-MM-DD')
      : undefined;

    const LIMIT = 10;

    const result = await entityManager.query(`
      SELECT
        data,
        COUNT(*) AS count
      FROM
        screen_events
      WHERE
        event = '${EVENT}'
       ${FROM && TO ? `AND occurred_on BETWEEN '${FROM}' AND '${TO}'` : ''}
      GROUP BY
        data#>>'{id}', data
      ORDER BY
        count DESC
      LIMIT ${LIMIT}`);

    return result;
  }

  async mostVisitedMalls(criteria?: Criteria): Promise<any[]> {
    const entityManager = getManager();

    const finalFilters = criteria?.toPrimitives().filters;

    const EVENT = 'USER_VISITED_RESTAURANT';

    const FROM = finalFilters?.from
      ? DateTimeUtils.format(finalFilters.from, 'YYYY-MM-DD')
      : undefined;
    const TO = finalFilters?.to
      ? DateTimeUtils.format(finalFilters.to, 'YYYY-MM-DD')
      : undefined;

    const LIMIT = 10;

    const result = await entityManager.query(`
      SELECT
        data,
        COUNT(*) AS count
      FROM
        screen_events
       ${FROM && TO ? `WHERE occurred_on BETWEEN '${FROM}' AND '${TO}'` : ''}
      GROUP BY
        data#>>'{mallId}', data
      ORDER BY
        count DESC
      LIMIT ${LIMIT}`);

    return result;
  }

  async mostVisitedPromotions(criteria?: Criteria): Promise<any[]> {
    const entityManager = getManager();

    const finalFilters = criteria?.toPrimitives().filters;

    const EVENT = 'USER_VISITED_PROMOTION';

    const FROM = finalFilters?.from
      ? DateTimeUtils.format(finalFilters.from, 'YYYY-MM-DD')
      : undefined;
    const TO = finalFilters?.to
      ? DateTimeUtils.format(finalFilters.to, 'YYYY-MM-DD')
      : undefined;

    const LIMIT = 10;

    const result = await entityManager.query(`
      SELECT
        data,
        COUNT(*) AS count
      FROM
        screen_events
      WHERE
        event = '${EVENT}'
       ${FROM && TO ? `AND occurred_on BETWEEN '${FROM}' AND '${TO}'` : ''}
      GROUP BY
        data#>>'{id}', data
      ORDER BY
        count DESC
      LIMIT ${LIMIT}`);

    return result;
  }

  async mostVisitedRestaurants(criteria?: Criteria): Promise<any[]> {
    const entityManager = getManager();

    const finalFilters = criteria?.toPrimitives().filters;

    const EVENT = 'USER_VISITED_RESTAURANT';

    const FROM = finalFilters?.from
      ? DateTimeUtils.format(finalFilters.from, 'YYYY-MM-DD')
      : undefined;
    const TO = finalFilters?.to
      ? DateTimeUtils.format(finalFilters.to, 'YYYY-MM-DD')
      : undefined;

    const LIMIT = 10;

    const result = await entityManager.query(`
      SELECT
        data,
        COUNT(*) AS count
      FROM
        screen_events
      WHERE
        event = '${EVENT}'
       ${FROM && TO ? `AND occurred_on BETWEEN '${FROM}' AND '${TO}'` : ''}
      GROUP BY
        data#>>'{id}', data
      ORDER BY
        count DESC
      LIMIT ${LIMIT}`);

    return result;
  }

  async restaurantWithMoreReservations(criteria?: Criteria): Promise<any[]> {
    const entityManager = getManager();

    const finalFilters = criteria?.toPrimitives().filters;

    const FROM = finalFilters?.from
      ? DateTimeUtils.format(finalFilters.from, 'YYYY-MM-DD')
      : undefined;
    const TO = finalFilters?.to
      ? DateTimeUtils.format(finalFilters.to, 'YYYY-MM-DD')
      : undefined;

    const LIMIT = 10;

    const result = await entityManager.query(`
      SELECT
        restaurant_id as id,
        restaurant,
        COUNT(*) AS count
      FROM
        reservation
       ${FROM && TO ? ` WHERE occurred_on BETWEEN '${FROM}' AND '${TO}'` : ''}
      GROUP BY
        restaurant_id, restaurant
      ORDER BY
        count DESC
      LIMIT ${LIMIT}`);

    return result;
  }
}
