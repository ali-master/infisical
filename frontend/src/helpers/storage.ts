import { kindOf } from "@app/helpers/kind-of";

/**
 * Reads a value from the browser's localStorage using the provided key.
 *
 * @param {string} key - The key of the value to be read from localStorage.
 * @param {any} defaultValue - The default value to be returned if the requested key does not exist in localStorage. (optional)
 *
 * @returns {any | undefined} The requested value if it exists in localStorage, or the defaultValue if provided and the value does not exist.
 */
export function read<T extends any>(key: string, defaultValue?: T): T | undefined {
  const value = localStorage.getItem(key);

  if (value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value as T;
    }
  }

  return defaultValue;
}

/**
 * Writes the given value to the localStorage with the specified key.
 *
 * @param {string} key - The key under which the value should be stored in localStorage.
 * @param {*} value - The value to be stored in localStorage.
 *
 * @return {void}
 */
export function write(key: string, value: any): void {
  const valueIsArrayOrObject = kindOf(value) === "object" || kindOf(value) === "array";

  localStorage.setItem(key, valueIsArrayOrObject ? JSON.stringify(value) : value);
}

/**
 * Removes the item with the given key from the localStorage.
 *
 * @param {string} key - The key of the item to be removed.
 * @return {void}
 */
export function remove(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Clears all the data stored in the localStorage.
 *
 * @return {void}
 */
export function clear(): void {
  localStorage.clear();
}
