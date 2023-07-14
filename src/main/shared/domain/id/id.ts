import fadmin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import ValueObject from '../value-object/value-object';

interface IdProps {
  value: string;
}

export default class Id extends ValueObject<IdProps> {
  constructor(id?: string) {
    super({
      value: id,
    });

    if (!this.props.value) {
      this.props.value = this.gen();
    }
  }

  private gen() {
    const id: string = fadmin.firestore().collection('test').doc().id;
    return id;

    return uuidv4();
  }

  get value() {
    return this.props.value;
  }

  toPrimitives() {
    return this.value;
  }

  toString() {
    return this.value;
  }
}
