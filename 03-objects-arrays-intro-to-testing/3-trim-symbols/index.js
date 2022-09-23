/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (!isFinite(size)) return string;

    function createSymbolCounter() {
        let currentSymbol;
        let numberOfConsequentSymbols;
        return function (symbol) {  //check for undefined input
            if (symbol === currentSymbol) numberOfConsequentSymbols++;
            else {
                currentSymbol = symbol;
                numberOfConsequentSymbols = 1;
            }
            return numberOfConsequentSymbols;
        }
    }
    const symbolCounter = createSymbolCounter();

    return string
        .split('')
        .reduce((resultingString, symbol) => symbolCounter(symbol) <= size ?
            resultingString += symbol :
            resultingString
            , '');
}