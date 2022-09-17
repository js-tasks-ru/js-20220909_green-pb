/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
    const result = {};
    const keysToCopy = Object.keys(obj).filter((key) => !fields.includes(key));
    keysToCopy.forEach( key => result[key] = obj[key]);
    return result;
};