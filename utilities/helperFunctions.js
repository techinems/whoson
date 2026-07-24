const makeWhosonDate = date => {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  let day = date.getDate();
  day = day < 10 ? "0" + day : day;
  return year + "-" + month + "-" + day;
};

// Resolve a /whoson command argument into an upstream query descriptor.
// Pure and side-effect free so it can be unit tested. `now` defaults to the
// current time. Behavior mirrors the original inline switch exactly.
//
// Returns one of:
//   { type: "today" }
//   { type: "week" }
//   { type: "date", date: "YYYY-MM-DD" | "YYYY-MM-DD&yesterday=1" | "...&tomorrow=1" }
//   { type: "invalid" }
const resolveWhosonQuery = (text, now = new Date()) => {
  const arg = (text || "").toLowerCase();

  if (arg === "" || arg === "today") {
    return { type: "today" };
  }
  if (arg === "week") {
    return { type: "week" };
  }

  const d = now;
  const o = new Date(now.getTime());

  switch (arg) {
    case "yest":
    case "yesterday":
      o.setDate(d.getDate() - 1);
      return { type: "date", date: makeWhosonDate(o) + "&yesterday=1" };

    case "tom":
    case "tomorrow":
      o.setDate(d.getDate() + 1);
      return { type: "date", date: makeWhosonDate(o) + "&tomorrow=1" };

    case "sun":
    case "sunday":
      o.setDate(d.getDate() + (7 - d.getDay()));
      return { type: "date", date: makeWhosonDate(o) };

    case "mon":
    case "monday":
      if (d.getDay() < 1) {
        o.setDate(d.getDate() + (1 - d.getDay()));
      } else {
        o.setDate(d.getDate() + (7 - (d.getDay() - 1)));
      }
      return { type: "date", date: makeWhosonDate(o) };

    case "tues":
    case "tuesday":
      if (d.getDay() < 2) {
        o.setDate(d.getDate() + (2 - d.getDay()));
      } else {
        o.setDate(d.getDate() + (7 - (d.getDay() - 2)));
      }
      return { type: "date", date: makeWhosonDate(o) };

    case "wed":
    case "wednesday":
      if (d.getDay() < 3) {
        o.setDate(d.getDate() + (3 - d.getDay()));
      } else {
        o.setDate(d.getDate() + (7 - (d.getDay() - 3)));
      }
      return { type: "date", date: makeWhosonDate(o) };

    case "thurs":
    case "thursday":
      if (d.getDay() < 4) {
        o.setDate(d.getDate() + (4 - d.getDay()));
      } else {
        o.setDate(d.getDate() + (7 - (d.getDay() - 4)));
      }
      return { type: "date", date: makeWhosonDate(o) };

    case "fri":
    case "friday":
      if (d.getDay() < 5) {
        o.setDate(d.getDate() + (5 - d.getDay()));
      } else {
        o.setDate(d.getDate() + (7 - (d.getDay() - 5)));
      }
      return { type: "date", date: makeWhosonDate(o) };

    case "sat":
    case "saturday":
      o.setDate(d.getDate() + (6 - d.getDay()));
      return { type: "date", date: makeWhosonDate(o) };

    default:
      return { type: "invalid" };
  }
};

module.exports = { makeWhosonDate, resolveWhosonQuery };
