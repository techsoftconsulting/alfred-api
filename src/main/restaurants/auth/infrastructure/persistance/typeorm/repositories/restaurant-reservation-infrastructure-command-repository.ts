import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { ReservationEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/reservation-entity';
import RestaurantReservationRepository from '@restaurants/auth/domain/repositories/restaurant-reservation-repository';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';

export default class RestaurantReservationInfrastructureCommandRepository
  extends TypeOrmRepository<ReservationEntity>
  implements RestaurantReservationRepository
{
  static readonly bindingKey = 'RestaurantReservationRepository';

  getEntityClass(): any {
    return ReservationEntity;
  }

  async findReservations(filter: any): Promise<any[]> {
    const final = NestjsCriteriaConverter.convert(filter);
    const repository = this.repository();
    const promotions = await repository.find(final);
    return promotions;
  }

  async getReservation(id: string): Promise<any | undefined> {
    const repository = this.repository();
    const reservation = await repository.findOne({
      where: {
        id: id,
      },
    });
    return reservation || undefined;
  }

  async createReservation(item: any): Promise<any> {
    await this.guardValidReservation(item);
    const repository = this.repository();
    const createdReservation = await repository.save(item);
    return createdReservation;
  }

  async updateReservation(item: any): Promise<any> {
    await this.guardValidReservation(item);
    const repository = this.repository();
    const updatedReservation = await repository.save(item);
    return updatedReservation;
  }

  async deleteReservation(id: string): Promise<any> {
    const repository = this.repository();
    const reservation = await repository.findOne({
      where: {
        id: id,
      },
    });
    if (reservation) {
      await repository.save({
        ...reservation,
        status: 'DELETED',
      });
    }
  }

  private async guardValidReservation(reservation: any): Promise<boolean> {
    // Check if there is no reservation for the table at the given date and hour
    const repository = this.repository();
    const existingReservation = await repository
      .createQueryBuilder('r')
      .select('r')
      .where('r.restaurant_id = :restaurant', {
        restaurant: reservation.restaurantId,
      })
      .andWhere('r.date = :date', { date: reservation.date })
      .andWhere('r.hour = :hour', { hour: reservation.hour })
      .andWhere('r.table  @> :table', { table: { id: reservation.table.id } })
      .andWhere('r.status = :status', { status: 'ACTIVE' })
      .getOne();
    if (existingReservation) {
      throw new Error('invalid_reservation');
    }

    return true;
  }
}
