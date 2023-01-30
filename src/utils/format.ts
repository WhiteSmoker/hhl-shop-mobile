/* eslint-disable no-bitwise */
export const formatLargeNumber = (num: number) => {
  if (num < 1000) {
    return num;
  }
  const q = Math.floor(num / 1000);
  const n = Math.floor((num % 1000) / 100);
  return q + '.' + n + 'K';
};

export const formatTime = (seconds: number) => {
  // Hours, minutes and seconds
  if (typeof seconds !== 'number') {
    return '0s';
  }
  const second = ~~seconds;
  const hrs = ~~(second / 3600);
  const mins = ~~((second % 3600) / 60);
  const secs = ~~second % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';
  if (hrs > 0) {
    ret += '' + hrs + 'h' + (mins < 10 ? '0' : '');
  }
  if (mins > 0) {
    ret += '' + mins + 'm' + (secs < 10 ? '0' : '');
  }
  ret += '' + secs + 's';
  return ret;
};

export const formatMMSS = (second: number) => {
  // tslint:disable-next-line: no-bitwise
  const roundingSecond = ~~second;
  const hour = Math.floor(roundingSecond / 3600);
  const minute = Math.floor((roundingSecond % 3600) / 60);
  const remainderSecond = roundingSecond % 60;
  return `${hour > 0 ? (hour < 10 ? `0${hour}:` : `${hour}:`) : ''}${minute < 10 ? `0${minute}` : minute}:${
    remainderSecond < 10 ? `0${remainderSecond}` : remainderSecond
  }`;
};

export const convertTimeToUTC = (date: Date) => {
  const isoDate = date.toISOString();
  return `${isoDate.substring(0, 10)} ${isoDate.substring(11, 19)}`;
};

export const stringNoNumberSign = (s: string) => {
  return s.split('#').join(' ').trim().split(' ').join('#');
};

export const stringToSlug = (str: string) => {
  str = str.toString().toLowerCase().trim();

  str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
  str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
  str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
  str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
  str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
  str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
  str = str.replace(/(đ)/g, 'd');

  str = str.replace(/([^0-9a-z-\s])/g, '');

  str = str.replace(/(\s+)/g, '-');

  str = str.replace(/^-+/g, '');

  str = str.replace(/-+$/g, '');

  return str;
};

export const parseParams = (params: { [k: string]: any }) => {
  const keys = Object.keys(params);
  let options = '';

  keys.forEach(key => {
    const isParamTypeObject = typeof params[key] === 'object';
    const isParamTypeArray = isParamTypeObject && params[key].length >= 0;

    if (!isParamTypeObject) {
      if (params[key] !== null || params[key] !== undefined || params[key] !== '') {
        options += `${key}=${params[key]}&`;
      }
    }

    if (isParamTypeObject && isParamTypeArray) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      params[key].forEach((element: any) => {
        options += `${key}=${element}&`;
      });
    }
  });

  return options ? options.slice(0, -1) : options;
};

export const urlToObject = <T extends {}>(url: string) =>
  url.split('&').reduce((prev, curr) => {
    const currArr = curr.split('=');
    return { ...prev, [currArr[0]]: currArr[1] };
  }, {} as T);
