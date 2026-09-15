export const isLeapYear = (year) => {
  return new Date(year, 2, 0).getDate() === 29;
};

// module.exports = {
//     isLeapYear
// }
