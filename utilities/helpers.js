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
  if (t.length < 2) return null;
  const short = t.substring(0,2);
  switch (short) {
    case 'ye':
      return dateForRelative("yesterday", -1);
    case 'to':
      return dateForRelative("tomorrow", 1);
    case 'su':
      return dateForOffset(0);
    case 'mo':
      return dateForOffset(1);
    case 'tu':
      return dateForOffset(2);
    case 'we':
      return dateForOffset(3);
    case 'th':
      return dateForOffset(4);
    case 'fr':
      return dateForOffset(5);
    case "sa":
      return dateForOffset(6);
    default:
      return null
  }
};

module.exports = { dateForDayOffset, dateForRelative, getDate };
