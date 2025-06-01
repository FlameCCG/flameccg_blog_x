import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

type FormatDateType = 'dateTime' | 'date' | 'time' | 'relativeTime' | undefined;
// 年月日时分秒
export function dateTimeFormat(rawDate: string): string {
  return dayjs(rawDate).format('YYYY-MM-DD HH:mm:ss');
}
// 年月日
export function dateFormat(rawDate: string): string {
  return dayjs(rawDate).format('YYYY-MM-DD');
}
// 时分秒
export function timeFormat(rawDate: string): string {
  return dayjs(rawDate).format('HH:mm:ss');
}

// 相对时间
export function relativeTimeFormat(rawDate: string): string {
  return dayjs(rawDate).fromNow();
}

export function formatDate(rawDate: string, formatT: string): string {
  if (formatT === 'dateTime') {
    return dateTimeFormat(rawDate);
  } else if (formatT === 'date') {
    return dateFormat(rawDate);
  } else if (formatT === 'time') {
    return timeFormat(rawDate);
  } else if (formatT === 'relativeTime') {
    return relativeTimeFormat(rawDate);
  }
  return dateTimeFormat(rawDate);
}
