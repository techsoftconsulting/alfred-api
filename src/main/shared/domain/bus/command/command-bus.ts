import Command from './command';

export default interface CommandBus {
    dispatch(command: Command): Promise<any>;
    onSuccess?: (command: Command, callback: () => void) => void;
    onError?: (command: Command, callback: () => void) => void;
}
