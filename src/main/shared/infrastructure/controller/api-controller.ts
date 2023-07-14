import Query from '@shared/domain/bus/query/query';
import QueryBus from '@shared/domain/bus/query/query-bus';
import { QueryResponse } from '@shared/domain/bus/query/query-response';
import { inject } from '@shared/domain/decorators';
import MultipartHandler from '@shared/domain/storage/multipart-handler';
import { ObjectUtils } from '@shared/domain/utils';
import Command from '../../domain/bus/command/command';
import CommandBus from '../../domain/bus/command/command-bus';

export default abstract class ApiController {
  constructor(
    @inject('command.bus')
    private commandBus: CommandBus,
    @inject('query.bus')
    private queryBus: QueryBus,
    @inject('multipart.handler')
    private multipartHandler: MultipartHandler<Request, Response>,
  ) {}

  protected ask(query: Query): Promise<QueryResponse> {
    return this.queryBus.ask(query);
  }

  protected getQueryOrderFromDto(order: string[]) {
    const orderString = <string>(<unknown>order);

    if (order.length === 0)
      return [
        {
          orderBy: 'id',
          orderType: 'DESC',
        },
      ];

    return order.map && order.length > 1
      ? // eslint-disable-next-line no-shadow
        order.map((orderString: string) => ({
          orderBy: orderString.split(' ')[0],
          orderType: orderString.split(' ')[1],
        }))
      : [
          {
            orderBy: orderString.split(' ')[0],
            orderType: orderString.split(' ')[1],
          },
        ];
  }

  protected async getFilesAndFields<T>(request: Request, response: Response) {
    const { files, fields } = await this.multipartHandler.getFilesAndFields<T>(
      request,
      response,
    );

    return { files: files, fields };
  }

  protected pickFile(path: string, files: any) {
    return ObjectUtils.get(files, path);
  }

  protected base64ToBuffer(base64String: string) {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches) throw new Error('Invalid base64 file string');

    const data = Buffer.from(matches[2], 'base64');
    return data;
  }

  protected dispatch(command: Command): Promise<any> {
    return this.commandBus.dispatch(command);
  }
}
