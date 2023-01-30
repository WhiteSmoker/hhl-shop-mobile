import { differenceInWeeks, formatDistanceToNowStrict } from 'date-fns';
import locale from 'date-fns/locale/en-US';
export const formatDistanceLocale: any = {
  lessThanXSeconds: '{{count}}s',
  xSeconds: '{{count}}s',
  halfAMinute: '30s',
  lessThanXMinutes: '{{count}}m',
  xMinutes: '{{count}}m',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}w',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
};

export function formatDistance(token: any, count: any, options: any) {
  options = options || {};
  let result = '';
  if (token === 'aboutXMonths' || token === 'xMonths') {
    result = `${count * 4}w`;
  } else {
    result = formatDistanceLocale[token].replace('{{count}}', count || 1);
  }

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return 'in ' + result;
    } else {
      return result;
    }
  }

  return result;
}

export const diffFormatDistanceMonthMinute = (date: Date | string) => {
  const weeks = differenceInWeeks(new Date(), new Date(date));
  if (weeks && weeks <= 52) {
    return `${weeks}w`;
  } else {
    return formatDistanceToNowStrict(new Date(date), {
      addSuffix: true,
      locale: {
        ...locale,
        formatDistance,
      },
    });
  }
};
