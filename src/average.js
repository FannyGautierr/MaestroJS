
/*
@param {array} numbers
@assert {array} numbers.length > 0
@throws {TypeError} if numbers is not an array
@return {number} average
 */

export function average(numbers) {
  if(typeof numbers !== typeof []) {
    throw new TypeError('average() expects an array');
  }
  return numbers.reduce((a, b) => a + b) / numbers.length;
}
