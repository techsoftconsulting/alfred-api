import Translator from '@shared/domain/translations/translator';
import { AnyObject } from '@shared/domain/types';
import Polyglot from 'node-polyglot';
//import nl from './trans/nl.json';

export default class PolyglotTranslator implements Translator {
  private polyglot: Polyglot;

  constructor() {
    this.polyglot = new Polyglot();

    //      this.polyglot.extend(nl);
    //this.polyglot.extend(nl);
  }

  translate(key: string, params?: AnyObject, lang?: string): string {
    return this.polyglot.t(key, params);
  }
}
