const pad = val => val < 10 ? "0" + val : val;
const makeDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const dateForOffset = offset => {
  const d = new Date();
  let o = new Date();
  if (d.getDay() < offset || offset === 6) {
    o.setDate(d.getDate() + (offset - d.getDay()));
  } else if (offset !== 0) {
    o.setDate(d.getDate() + (7 - (d.getDay() - offset)));
  }
  return makeDate(o);
};

const dateForRelative = (name, offset) => {
  let o = new Date();
  o.setDate((new Date()).getDate() + offset);
  return `${makeDate(o)}&${name}=1`;
};

const getDate = t => {
  if (t === "yest" || t === "yesterday") return dateForRelative("yesterday", -1);
  if (t === "tom" || t === "tomorrow") return dateForRelative("tomorrow", 1);
  if (t === "sun" || t === "sunday") return dateForOffset(0);
  if (t === "mon" || t === "monday") return dateForOffset(1);
  if (t === "tues" || t === "tuesday") return dateForOffset(2);
  if (t === "wed" || t === "wednesday") return dateForOffset(3);
  if (t === "thurs" || t === "thursday") return dateForOffset(4);
  if (t === "fri" || t === "friday") return dateForOffset(5);
  if (t === "sat" || t === "saturday") return dateForOffset(6);
  return null;
};

module.exports = { dateForDayOffset, dateForRelative, getDate };
