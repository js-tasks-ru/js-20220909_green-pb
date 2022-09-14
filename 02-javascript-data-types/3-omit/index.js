/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export 
const omit = (obj, ...fields) => {
    let result = {...obj}; // shallow copy, TODO deep copy
    
    for (let key of fields){
        delete result[key]; // no error if key is not present
    }

    return result;
};

// const fruits = {
//     apple: 2,
//     orange: 4,
//     banana: 3
//    };
   
//    console.log(omit(fruits, 'apple', 'banana')); // Вернет обїект - { orange: 4 }