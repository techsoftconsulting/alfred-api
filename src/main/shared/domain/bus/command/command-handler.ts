import Command from './command';

export default interface CommandHandler {
    getCommandName(): string;
    handle(command: Command): void | Promise<any>;
}
