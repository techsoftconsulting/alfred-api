import { ArrayUtils, ObjectUtils } from '@shared/domain/utils';
import Id from '../id/id';
import Model from '../models/model';

type Entity = { id: Id };

export default class Collection<T> {
  private _items: Array<T>;

  constructor(items: Array<T>) {
    this._items = items;
  }

  get items() {
    return this._items;
  }

  each(callback: (item: T) => any) {
    this.items.forEach(callback);
  }

  concat(newItems: Collection<T>) {
    return new Collection(this.items.concat(newItems.items));
  }

  map(callback: (item: T) => any) {
    return this.items.map(callback);
  }

  find(properties: Partial<T> | any) {
    return ObjectUtils.find(this.items, properties);
  }

  add(...items: T[]) {
    this.items.push(...items);
  }

  getAt(index: number): T {
    return this.items[index];
  }

  filter(criteria: any): Collection<T> {
    return new Collection(ArrayUtils.filter(this.items, criteria));
  }

  findIndex(criteria: any): number {
    return ArrayUtils.findIndex(this.items, criteria);
  }

  findById(id: Id) {
    const found = this.items.find((item: any) => {
      return item.id.value == id.value;
    });

    return found;
  }

  removeById(id: Id) {
    this._items = this.items.filter((item: any) => {
      return item.id.value !== id.value;
    });

    return this._items;
  }

  findContaining(containingItems: Collection<T>) {
    const containing = this.items.filter((item: any) => {
      return (
        containingItems.items
          .map((e: any) => e.id.value)
          .indexOf(item.id.value) > -1
      );
    });

    return containing;
  }

  subtract(collection: Collection<T>): Collection<T> {
    return new Collection(
      ArrayUtils.differenceWith(
        this.items,
        collection.items,
        (e: any, i: any) => {
          return e.id.value === i.id.value;
        },
      ),
    );
  }

  replaceAt(index, newElement: T) {
    this.items.splice(index, 1, newElement);
  }

  /*   omitItems() {
        omit(object, ['a', 'c']);
    } */
  sortItemsBy(sortBy: string, sortMethod: 'asc' | 'desc') {
    return new Collection(ArrayUtils.orderBy(this.items, sortBy, sortMethod));
  }

  count() {
    return this.items.length;
  }

  toPrimitives() {
    //        return this.items.map((item) => item instanceof Model && item.toJson());

    return this.items.map((item: any) => {
      if (typeof item.toPrimitives === 'function') {
        return item.toPrimitives();
      }

      return item instanceof Model ? item.toJson() : item;
    });
  }
}
