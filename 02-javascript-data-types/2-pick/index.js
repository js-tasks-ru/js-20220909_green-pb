/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    const result = {};
    const keysToCopy = Object.keys(obj).filter((key) => fields.includes(key));
    keysToCopy.forEach( key => result[key] = obj[key]);
    return result;
};