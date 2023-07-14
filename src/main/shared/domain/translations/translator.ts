import {AnyObject} from '../types';

export default interface Translator {
    translate(key: string, params?: AnyObject, lang?: string): string;
}
