import {AnyObject} from '@shared/domain/types';

type EventData = AnyObject;

export interface DomainEventProps {
    aggregateId: string;
    occurredOn: Date;
    eventId?: string;
    eventData: EventData;
}

export default abstract class DomainEvent<T extends DomainEventProps> {
    public readonly props: T;

    constructor(props: T) {
        Object.assign(this, {
            ...{eventData: {}},
            props,
            eventData: props.eventData,
        });
    }

    abstract eventName(): string;

    get aggregateId() {
        return this.props.aggregateId;
    }

    get occurredOn() {
        return this.props.occurredOn;
    }

    get eventId() {
        return this.props.eventId;
    }
}
