import DomainEvent, {
  DomainEventProps,
} from '../../../../shared/domain/bus/event/domain-event';

const EVENT_NAME = 'ADMIN_REGISTERED';

interface EventProps extends DomainEventProps {
  eventData: {
    userEmail: string;
    userId: string;
  };
}

export default class AdminRegistered extends DomainEvent<EventProps> {
  static eventName: string = EVENT_NAME;

  constructor(props: EventProps) {
    super({ ...props, occurredOn: new Date() });
  }

  get userEmail() {
    return this.props.eventData.userEmail;
  }

  get userId() {
    return this.props.eventData.userId;
  }

  eventName(): string {
    return EVENT_NAME;
  }
}
