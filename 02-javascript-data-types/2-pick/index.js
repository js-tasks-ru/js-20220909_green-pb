/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export
 const pick = (obj, ...fields) => {
    let result = {};
    for (let key of fields){
        result[key] = obj[key];
    }

    return result;
};

// const fruits = {
//     apple: 2,
//     orange: 4,
//     banana: 3
//    };
   
//    console.log(pick(fruits, 'apple', 'banana')); // { apple: 2, banana: 3 }