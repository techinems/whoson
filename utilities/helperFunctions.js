/**
 * Function to convert javascript date object to date string as formated in website database.
 * 
 * @param {date} date - date object to be converted
 * @returns {string} datestring - "year-month-day" formatted string
 */
const makeWhosonDate = date => {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  let day = date.getDate();
  day = day < 10 ? "0" + day : day;
  return year + "-" + month + "-" + day;
};

module.exports = { makeWhosonDate };
