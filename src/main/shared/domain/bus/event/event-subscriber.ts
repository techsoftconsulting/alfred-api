export default interface EventSubscriber {
    subscribedTo(): Map<string, Function>;
}
