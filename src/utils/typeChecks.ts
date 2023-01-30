/**
 * @param target
 * @param source
 */
export function merge(target: any, source: any): void {
  if (!isObject(target) && !isObject(source)) {
    return;
  }
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key) as boolean) {
      const targetProp = target[key];
      const sourceProp = source[key];
      if (isObject(sourceProp) && isObject(targetProp) && !isArray(sourceProp) && !isArray(targetProp)) {
        merge(targetProp, sourceProp);
      } else {
        if (isValid(source[key])) {
          target[key] = source[key];
        }
      }
    }
  }
}

/**
 * @param target
 * @return {{}|*}
 */

/**
 * @param value
 * @return {boolean}
 */
export function isArray(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Array]';
}

/**
 * @param {*} value
 * @return {boolean}
 */
export function isFunction(value: any): boolean {
  return typeof value === 'function';
}

/**
 * @param {*} value
 * @return {boolean}
 */
export function isObject(value: any): boolean {
  return typeof value === 'object';
}

/**
 * @param value
 * @returns {boolean}
 */
export function isNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * @param value
 * @returns {boolean}
 */
export function isValid(value: any | null): boolean {
  return value !== null && value !== undefined;
}

/**
 * @param value
 * @returns {boolean}
 */
export function isBoolean(value: any): boolean {
  return typeof value === 'boolean';
}

/**
 * @param value
 * @return {boolean}
 */
export function isString(value: any): boolean {
  return typeof value === 'string';
}

export const isValidIndex = (index: number | null | undefined) => typeof index === 'number' && index >= 0;
