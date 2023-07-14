import Criteria from '@shared/domain/criteria/criteria';

export default interface AdminStatsRepository {
  mostVisitedRestaurants(criteria?: Criteria): Promise<any[]>;

  mostSearchedRestaurants(criteria?: Criteria): Promise<any[]>;

  mostVisitedMalls(criteria?: Criteria): Promise<any[]>;

  mostSearchedMalls(criteria?: Criteria): Promise<any[]>;

  restaurantWithMoreReservations(criteria?: Criteria): Promise<any[]>;

  mostVisitedPromotions(criteria?: Criteria): Promise<any[]>;
}
