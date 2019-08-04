const makeWhosonDate = date => {
  const year = date.getFullYear();
  let month = date.getMonth() + 1 < 10 ? "0" + month : month;
  month = month < 10 ? "0" + month : month;
  let day = date.getDate();
  day = day < 10 ? "0" + day : day;
  return year + "-" + month + "-" + day;
};

module.exports = { makeWhosonDate };
