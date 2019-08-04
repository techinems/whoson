//node packages
const express = require("express");
const { get } = require("cachios");
require("dotenv").config();

//local packages
const { makeWhosonDate } = require("./utilities/helperFunctions.js");

//node package config
const app = express();

//globals
const RPIA_WEB_TOKEN = process.env.RPIA_WEB_TOKEN;

app.post("/whoson", async ({ body: { text } }, res) => {
  let done = false;
  if (text === "" || text.toLowerCase() === "today") {
    const { body } = await get(
      `https://rpiambulance.com/slack-whoson.php?token=${RPIA_WEB_TOKEN}`
    );
    res.send(body);
  } else if (text.toLowerCase() === "week") {
    const { body } = await get(
      `https://rpiambulance.com/slack-whoson.php?token=${RPIA_WEB_TOKEN}&week=1`
    );
    res.send(body);
  } else {
    const d = new Date();
    let o = new Date();
    let date;

    switch (text.toLowerCase()) {
      case "yest":
      case "yesterday":
        o.setDate(d.getDate() - 1);
        date = makeWhosonDate(o) + "&yesterday=1";
        break;

      case "tom":
      case "tomorrow":
        o.setDate(d.getDate() + 1);
        date = makeWhosonDate(o) + "&tomorrow=1";
        break;

      case "sun":
      case "sunday":
        o.setDate(d.getDate() + (7 - d.getDay()));
        date = makeWhosonDate(o);
        break;

      case "mon":
      case "monday":
        if (d.getDay() < 1) {
          o.setDate(d.getDate() + (1 - d.getDay()));
        } else {
          o.setDate(d.getDate() + (7 - (d.getDay() - 1)));
        }
        date = makeWhosonDate(o);
        break;

      case "tues":
      case "tuesday":
        if (d.getDay() < 2) {
          o.setDate(d.getDate() + (2 - d.getDay()));
        } else {
          o.setDate(d.getDate() + (7 - (d.getDay() - 2)));
        }
        date = makeWhosonDate(o);
        break;

      case "wed":
      case "wednesday":
        if (d.getDay() < 3) {
          o.setDate(d.getDate() + (3 - d.getDay()));
        } else {
          o.setDate(d.getDate() + (7 - (d.getDay() - 3)));
        }
        date = makeWhosonDate(o);
        break;

      case "thurs":
      case "thursday":
        if (d.getDay() < 4) {
          o.setDate(d.getDate() + (4 - d.getDay()));
        } else {
          o.setDate(d.getDate() + (7 - (d.getDay() - 4)));
        }
        date = makeWhosonDate(o);
        break;

      case "fri":
      case "friday":
        if (d.getDay() < 5) {
          o.setDate(d.getDate() + (5 - d.getDay()));
        } else {
          o.setDate(d.getDate() + (7 - (d.getDay() - 5)));
        }
        date = makeWhosonDate(o);
        break;

      case "sat":
      case "saturday":
        o.setDate(d.getDate() + (6 - d.getDay()));
        date = makeWhosonDate(o);
        break;

      default:
        res
          .status(400)
          .send("Please enter a valid day parameter and try again.");
        done = true;
    }

    if (!done) {
      const { body } = get(
        `https://rpiambulance.com/slack-whoson.php?token=${RPIA_WEB_TOKEN}&date=${date}`
      );
      res.send(body);
    }
  }
});
