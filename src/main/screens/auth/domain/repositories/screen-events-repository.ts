export type ScreenEventType =
  | 'RESTAURANT_VISIT'
  | 'RESTAURANT_SEARCH'
  | 'MALL_VISIT'
  | 'MALL_SEARCH'
  | 'PROMOTION_VISIT';

export interface ScreenEvent {
  id?: string;
  occurredOn: Date;
  event: ScreenEventType;
  data: any;
}

export default interface ScreenEventsRepository {
  track(event: ScreenEvent): Promise<void>;
}
