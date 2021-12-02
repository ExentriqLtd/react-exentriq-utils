import memoize from "fast-memoize";
import moment from 'moment';

const getFormattedTime = memoize((timestampDate: Date) => {
  const leadingZero = (timestampDate: number) => `0${timestampDate}`.slice(-2);
  return [timestampDate.getHours(), timestampDate.getMinutes()]
    .map(leadingZero)
    .join(":");
});

const getFormattedDate = memoize((timestamp: number): string => {
  const timestampDate = new Date(timestamp);
  const pad = (s: number) => (s < 10 ? "0" + s : s);
  return [
    pad(timestampDate.getDate()),
    pad(timestampDate.getMonth() + 1),
    pad(timestampDate.getFullYear()),
  ].join("/");
});

export const utilityGetRelativeDate = memoize((timestamp: number): string => {
  const timestampDate = new Date(timestamp);
  const isYesterday =
    timestampDate.getDate() === new Date().getDate() - 1 &&
    timestampDate.getMonth() === new Date().getMonth() &&
    timestampDate.getFullYear() === new Date().getFullYear();

  if (isYesterday) return "Ieri";
  return getFormattedDate(timestamp);
});

export const utilityCompleteDate = memoize((timestamp: number, locale: string): string => {
  const timestampDate = new Date(timestamp);
  moment.locale(locale);
  return moment(timestampDate).format('D MMMM YYYY, H:mm');
});

export const utilityFormatDate = memoize((timestamp: number): string => {
  const timestampDate = new Date(timestamp);
  const isToday =
    timestampDate.getDate() === new Date().getDate() &&
    timestampDate.getMonth() === new Date().getMonth() &&
    timestampDate.getFullYear() === new Date().getFullYear();
  if (isToday) return getFormattedTime(timestampDate);
  else return utilityGetRelativeDate(timestamp);
});

export const utilityFormatTime = memoize((timestamp: number): string => {
  const timestampDate = new Date(timestamp);
  const leadingZero = (timestampDate: number) => `0${timestampDate}`.slice(-2);
  return [timestampDate.getHours(), timestampDate.getMinutes()]
  .map(leadingZero)
  .join(":");
});
