import {AnyObject} from '@shared/domain/types';

export default abstract class Command {
    constructor(data?: AnyObject) {
        Object.assign(this, data);
    }
    abstract name(): string;
}
