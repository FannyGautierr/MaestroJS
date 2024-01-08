/**
 * Calculates the average of an array of numbers.
 *
 * @param {number[]} numbers - An array of numbers for which the average is to be calculated.
 * @returns {number} The average of the numbers in the array.
 * @throws {TypeError} Throws a TypeError if the input is not an array.
 *
 * @example
 * // returns 3
 * average([1, 2, 3, 4, 5]);
 *
 * @example
 * // throws TypeError
 * average("not an array");
 */

export default function average(numbers) {
  if(typeof numbers !== typeof []) {
    throw new TypeError('average() expects an array');
  }
  return numbers.reduce((a, b) => a + b) / numbers.length;
}

console.log("maestro")