import ValueObject from '../value-object/value-object';

interface EmailProps {
  value: string;
}

export default class Email extends ValueObject<EmailProps> {
  constructor(value: string) {
    super({ value: '' });

    if (!this.validate(value)) {
      throw new Error('INVALID_EMAIL');
    }

    this.props.value = value.toLowerCase();
  }

  get value() {
    return this.props.value;
  }

  private validate(value) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
  }

  toString() {
    return this.props.value;
  }

  toPrimitives() {
    return this.props.value;
  }
}
