import {v4 as uuidv4} from 'uuid';
import CodeGenerator from '../../domain/utils/code-generator';

export default class BasicUuidGenerator implements CodeGenerator {
    generate(): string {
        return uuidv4();
    }
}
