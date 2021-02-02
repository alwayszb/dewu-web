// https://momentjs.com/docs/

import moment from 'moment';

const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';
const SIMPLE_TIME_FORMAT = 'MM-DD HH:mm';

const now = () => moment();

const parse = (value) => moment(value);

const format = (value, f = TIME_FORMAT) => moment(value).format(f);

const formatToDate = (date = now()) => moment(date).format(DATE_FORMAT);

const formatToTime = (date = now()) => moment(date).format(TIME_FORMAT);

const formatToSimpleTime = (date = now()) => moment(date).format(SIMPLE_TIME_FORMAT);

const getMoment = (input, f) => moment(input, f);

const formatCurrent = (f) => format(moment(), f);

const getDaysDuration = (start, end) => parse(end).diff(parse(start), 'days');

const isSameDay = (date1, date2) => parse(date1).isSame(date2, 'days');

export default {
  DATE_FORMAT,
  TIME_FORMAT,
  SIMPLE_TIME_FORMAT,
  now,
  parse,
  format,
  formatToDate,
  formatToTime,
  formatToSimpleTime,
  getMoment,
  formatCurrent,
  getDaysDuration,
  isSameDay,
};
