const EventEmitter = require('events');
import Query from '@shared/domain/bus/query/query';
import QueryBus from '@shared/domain/bus/query/query-bus';
import { QueryResponse } from '@shared/domain/bus/query/query-response';
import { inject } from '@shared/domain/decorators';
import QueryHandler from '../../../domain/bus/query/query-handler';
import service from '../../../domain/decorators/service';

@service()
export default class NodejsQueryBus implements QueryBus {
  public emitter: typeof EventEmitter;

  public handlers: Array<QueryHandler>;

  constructor(
    @inject('query.bus.handlers')
    handlers: Array<QueryHandler>,
  ) {
    this.handlers = handlers;
    this.emitter = new EventEmitter();
    this.execute();
  }

  onSuccess(query: Query, successCallback: (data?: any) => void) {
    this.emitter.on(query.name + 'SuccessResponse', successCallback);
  }

  onError(query: Query, errorCallback: (data?: any) => void) {
    this.emitter.on(query.name + 'ErrorResponse', errorCallback);
  }

  execute() {
    this.handlers.forEach((handler: QueryHandler) => {
      this.emitter.on(handler.getQueryName(), async (query: Query) => {
        console.log(`New ${handler.getQueryName()}`);
        try {
          const response = await handler.handle(query);
          this.emitter.emit(query.name + 'SuccessResponse', response);
        } catch (e) {
          this.emitter.emit(query.name + 'ErrorResponse', e);
        }
      });
    });
  }

  async ask(query: Query): Promise<QueryResponse> {
    return new Promise((resolve, reject) => {
      this.emitter.emit(query.name(), query);
      this.onSuccess(query, (result) => {
        resolve(result);
      });

      this.onError(query, (error) => {
        reject(error);
      });
    });
  }
}
