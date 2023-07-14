import Model from '../models/model';

export default abstract class Entity<T> extends Model<T> {
  getId(): string {
    return typeof (this.props as any).id == 'string'
      ? (this.props as any).id
      : (this.props as any).id.toString();
  }

  getClassName() {
    return this.constructor.name;
  }
}
