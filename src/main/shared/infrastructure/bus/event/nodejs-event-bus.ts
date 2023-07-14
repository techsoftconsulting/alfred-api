const EventEmitter = require('events');
import { inject } from '@shared/domain/decorators';
import EventBus, { Event } from '../../../domain/bus/event/event-bus';
import EventSubscriber from '../../../domain/bus/event/event-subscriber';
import service from '../../../domain/decorators/service';

@service()
export default class NodejsEventBus implements EventBus {
  public emitter: typeof EventEmitter;

  public subscribers: Array<EventSubscriber>;

  constructor(
    @inject('event.bus.subscribers')
    subscribers: Array<EventSubscriber>,
  ) {
    this.subscribers = subscribers;
    this.emitter = new EventEmitter();
    this.execute();
  }

  execute() {
    this.subscribers.forEach((subscriber: EventSubscriber) => {
      const events: Map<String, Function> = subscriber.subscribedTo();

      events.forEach((handlerFunction, eventName) => {
        this.emitter.on(eventName, (event: Event) => {
          console.log(`Handling on ${event.eventName()}`);

          handlerFunction(event);
        });
      });
    });
  }

  publish(events: Array<Event>): boolean {
    events.forEach((event: Event) => {
      this.emitter.emit(event.eventName(), event);
    });
    return true;
  }
}
