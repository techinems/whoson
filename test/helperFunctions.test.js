const {
  makeWhosonDate,
  resolveWhosonQuery,
} = require("../utilities/helperFunctions.js");

describe("makeWhosonDate", () => {
  test("zero-pads month and day", () => {
    expect(makeWhosonDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
  test("does not pad two-digit month/day", () => {
    expect(makeWhosonDate(new Date(2026, 10, 23))).toBe("2026-11-23");
  });
});

describe("resolveWhosonQuery", () => {
  // Fixed reference: Wednesday, 2026-07-22 (local time)
  const now = new Date(2026, 6, 22, 12, 0, 0);

  test("reference date is a Wednesday (test fixture sanity)", () => {
    expect(now.getDay()).toBe(3);
  });

  test("empty and 'today' map to today (case-insensitive)", () => {
    expect(resolveWhosonQuery("", now)).toEqual({ type: "today" });
    expect(resolveWhosonQuery("today", now)).toEqual({ type: "today" });
    expect(resolveWhosonQuery("TODAY", now)).toEqual({ type: "today" });
  });

  test("'week' maps to week", () => {
    expect(resolveWhosonQuery("week", now)).toEqual({ type: "week" });
  });

  test("unknown argument is invalid", () => {
    expect(resolveWhosonQuery("someday", now)).toEqual({ type: "invalid" });
  });

  test("yesterday: date is now-1 with &yesterday=1 suffix", () => {
    const r = resolveWhosonQuery("yesterday", now);
    expect(r.type).toBe("date");
    expect(r.date).toBe("2026-07-21&yesterday=1");
    expect(resolveWhosonQuery("yest", now)).toEqual(r);
  });

  test("tomorrow: date is now+1 with &tomorrow=1 suffix", () => {
    const r = resolveWhosonQuery("tomorrow", now);
    expect(r.type).toBe("date");
    expect(r.date).toBe("2026-07-23&tomorrow=1");
    expect(resolveWhosonQuery("tom", now)).toEqual(r);
  });

  test("weekday keyword resolves to a date with that weekday, no suffix", () => {
    // From Wed 2026-07-22, the switch computes the *coming* instance of each day.
    const cases = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };
    for (const [word, weekday] of Object.entries(cases)) {
      const r = resolveWhosonQuery(word, now);
      expect(r.type).toBe("date");
      expect(r.date).not.toMatch(/&/); // no yesterday/tomorrow suffix
      // Parse the YYYY-MM-DD back and confirm the weekday matches.
      const [y, m, d] = r.date.split("-").map(Number);
      expect(new Date(y, m - 1, d).getDay()).toBe(weekday);
    }
  });

  test("short weekday aliases match their long forms", () => {
    for (const [short, long] of [
      ["sun", "sunday"],
      ["mon", "monday"],
      ["tues", "tuesday"],
      ["wed", "wednesday"],
      ["thurs", "thursday"],
      ["fri", "friday"],
      ["sat", "saturday"],
    ]) {
      expect(resolveWhosonQuery(short, now)).toEqual(
        resolveWhosonQuery(long, now)
      );
    }
  });
});
