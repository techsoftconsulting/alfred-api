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
  uniqBy as LUniqBy,
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
  export const uniqBy = LUniqBy;
}

export namespace DateTimeUtils {
  export const startOfWeek = (): Date => {
    return moment().startOf('week').toDate();
  };

  export const toTimezone = (date: Date, timezone: string) => {
    const milis =
      date.getTime() +
      (moment().utcOffset() - moment().tz(timezone).utcOffset()) * 60000;
    return new Date(milis);
  };

  export const fromString = (
    date: string,
    format: string | undefined = undefined,
    utc = false,
  ) => {
    if (utc) return moment(date, format).utc().toDate();
    return moment(date, format).toDate();
  };

  export const isPast = (date: Date) => {
    return moment(date).isBefore(new Date());
  };

  export const differenceInHours = (a: Date, b: Date): number => {
    return moment(a).diff(moment(b), 'hours');
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

  export const addHours = (a: Date, hours: number) => {
    return moment(a).clone().add(hours, 'hours').toDate();
  };

  export const addMinutes = (a: Date, minutes: number) => {
    return moment(a).clone().add(minutes, 'minutes').toDate();
  };

  export const fromTime = (
    time: string,
    format: string | undefined = 'HH:mm',
  ) => {
    return moment(time, format).toDate();
  };

  export const isBetween = (
    date: Date,
    limits: { start: Date; end: Date },
    inclusivity = '[]',
  ) => {
    return moment(date).isBetween(
      limits.start,
      limits.end,
      null, // can be year, month .... the granularity of your comaprison
      inclusivity,
    );
  };

  export const format = (date: Date, format: string) => {
    return moment(date).format(format);
  };

  export const toString = (date: Date) => {
    return moment(date).toString();
  };
}
