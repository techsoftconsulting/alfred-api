const EventEmitter = require('events');
import { inject } from '@shared/domain/decorators';
import Command from '../../../domain/bus/command/command';
import CommandBus from '../../../domain/bus/command/command-bus';
import CommandHandler from '../../../domain/bus/command/command-handler';
import service from '../../../domain/decorators/service';

@service()
export default class NodejsCommandBus implements CommandBus {
  public emitter: typeof EventEmitter;

  public handlers: Array<CommandHandler>;

  constructor(
    @inject('command.bus.handlers')
    handlers: Array<CommandHandler>,
  ) {
    this.handlers = handlers;
    this.emitter = new EventEmitter();
    this.execute();
  }

  onSuccess(command: Command, successCallback: (data?: any) => void) {
    this.emitter.on(command.name + 'SuccessResponse', successCallback);
  }

  onError(command: Command, errorCallback: (data?: any) => void) {
    this.emitter.on(command.name + 'ErrorResponse', errorCallback);
  }

  execute() {
    this.handlers.forEach((handler: CommandHandler) => {
      this.emitter.on(handler.getCommandName(), async (command: Command) => {
        console.log(`New ${handler.getCommandName()}`);

        try {
          const response = await handler.handle(command);
          this.emitter.emit(command.name + 'SuccessResponse', response);
        } catch (e) {
          this.emitter.emit(command.name + 'ErrorResponse', e);
        }
      });
    });
  }

  async dispatch(command: Command): Promise<any> {
    return new Promise((resolve, reject) => {
      this.emitter.emit(command.name(), command);
      this.onSuccess(command, (result) => {
        resolve(result);
      });

      this.onError(command, (error) => {
        reject(error);
      });
    });
  }
}
