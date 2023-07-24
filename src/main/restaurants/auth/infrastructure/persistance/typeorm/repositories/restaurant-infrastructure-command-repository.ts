import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import RestaurantRepository from '@restaurants/auth/domain/repositories/restaurant-repository';
import { getRepository } from 'typeorm';
import { RestaurantCategoryEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/restaurant-category-entity';
import { StoreEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/store-entity';
import RestaurantReservationUtils from '@screens/auth/infrastructure/service/restaurant-reservation-utils';
import { DateTimeUtils } from '@shared/domain/utils';

export default class RestaurantInfrastructureCommandRepository
  extends TypeOrmRepository<StoreEntity>
  implements RestaurantRepository
{
  static readonly bindingKey = 'RestaurantRepository';
  private utils: RestaurantReservationUtils;

  constructor() {
    super();
    this.utils = new RestaurantReservationUtils();
  }

  getEntityClass(): any {
    return StoreEntity;
  }

  async getProfileBySlug(slug: string): Promise<any | undefined> {
    const repository = this.repository();
    const profile = await repository.findOne({ where: { slug } });
    return profile || undefined;
  }

  async getProfileById(id: string): Promise<any | undefined> {
    const repository = this.repository();
    const profile = await repository.findOne({
      where: {
        id: id,
      },
    });
    return profile || undefined;
  }

  async findCategories(): Promise<any[]> {
    return getRepository(RestaurantCategoryEntity).find();
  }

  async updateRestaurant(restaurant: any): Promise<any> {
    const repository = this.repository();
    const found = await repository.findOne({
      where: {
        id: restaurant?.id,
      },
    });

    if (!found) {
      throw new Error('not_found');
    }

    const updatedRestaurant = await repository.save({
      ...restaurant,
      // uuid: found.uuid,
    });
    return updatedRestaurant;
  }

  async getNearAvailability(id: string): Promise<any> {
    const nextDays = (() => {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const nextDay = DateTimeUtils.addDays(new Date(), i);
        days.push(nextDay);
      }
      return days;
    })();

    const availabilityPerDay = await Promise.all(
      nextDays.map(async (date) => {
        return {
          date,
          slots: await this.utils.getDayAvailability2(id, date),
        };
      }),
    );

    const dayHours = availabilityPerDay.reduce((acc, availability) => {
      const dateName = DateTimeUtils.format(
        availability.date,
        'dddd',
      ).toUpperCase();

      return { ...acc, [dateName]: availability.slots };
    }, {});

    return dayHours;
  }

  async getDayAvailability(id: string, date: string): Promise<any> {
    return await this.utils.getDayAvailability2(id, date);
  }
}
