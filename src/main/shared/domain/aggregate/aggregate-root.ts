import DomainEvent from '../bus/event/domain-event';
import Entity from '../entity/entity';

export default abstract class AggregateRoot<T> extends Entity<T> {
    private domainEvents: Array<DomainEvent<any>> = [];

    pullDomainEvents(): Array<DomainEvent<any>> {
        const domainEvents = [...this.domainEvents];
        this.domainEvents = [];
        return domainEvents;
    }

    /* toPrimitives() {
        const base = super.toPrimitives();
        return ObjectUtils.omit(base, ['domainEvents']);
    }
 */
    protected record(event: DomainEvent<any>) {
        this.domainEvents.push(event);
    }
}
