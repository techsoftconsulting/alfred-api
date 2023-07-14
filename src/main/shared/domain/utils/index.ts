import {
  differenceWith as fnDifferenceWith,
  filter as fnFilter,
  find as fnFind,
  findIndex as fnFindIndex,
  flattenDeep as fnFlatten,
  get as fnGet,
  isNil,
  keys as fnKeys,
  map as fnMap,
  merge as fnMerge,
  omit as fnOmit,
  omitBy,
  orderBy as fnOrderBy,
  pick as fnPick,
  pickBy as fnPickBy,
  uniq as fnUniq,
  zipObject,
} from 'lodash';
import { AnyObject } from '../types';

const moment = require('moment');
export namespace ObjectUtils {
  export const omit = fnOmit;
  export const omitUnknown = (object: AnyObject) => {
    return omitBy(object, isNil);
  };
  export const pick = fnPick;
  export const pickBy = fnPickBy;
  export const keys = fnKeys;
  export const find = fnFind;
  export const zip = zipObject;
  export const get = fnGet;
  export const merge = fnMerge;
}

export namespace ArrayUtils {
  export const filter = fnFilter;
  export const differenceWith = fnDifferenceWith;
  export const orderBy = fnOrderBy;
  export const uniq = fnUniq;
  export const map = fnMap;
  export const flatten = fnFlatten;
  export const findIndex = fnFindIndex;
}

export namespace DateTimeUtils {
  export const startOfWeek = (): Date => {
    return moment().startOf('week').toDate();
  };

  export const endOfWeek = (): Date => {
    return moment().endOf('week').toDate();
  };
  export const differenceInDays = (a: Date, b: Date): number => {
    return moment(a).diff(moment(b), 'days');
  };

  export const differenceInMinutes = (a: Date, b: Date): number => {
    return moment(a).diff(moment(b), 'minutes');
  };

  export const startOfDate = (date: Date) => {
    return moment(date).clone().startOf('day').toDate();
  };

  export const endOfDate = (date: Date) => {
    return moment(date).clone().endOf('day').toDate();
  };

  export const addMonths = (a: Date, months: number) => {
    return moment(a).clone().add(months, 'months').toDate();
  };

  export const addDays = (a: Date, days: number) => {
    return moment(a).clone().add(days, 'days').toDate();
  };

  export const format = (date: Date, format: string) => {
    return moment(date).format(format);
  };

  export const toString = (date: Date) => {
    return moment(date).toString();
  };
}
