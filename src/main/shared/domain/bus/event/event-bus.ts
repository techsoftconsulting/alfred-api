import DomainEvent, {DomainEventProps} from './domain-event';

export type Event = DomainEvent<DomainEventProps>;

export default interface EventBus {
    publish(events: Array<Event>): void;
}
