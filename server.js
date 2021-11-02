//node packages
const express = require("express");
const axios = require("cachios");
const bodyParser = require("body-parser");
require("dotenv").config();

//local packages
const { makeWhosonDate } = require("./utilities/helperFunctions.js");

//node package config
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//globals
const RPIA_WEB_TOKEN = process.env.RPIA_WEB_TOKEN;
const SLACK_SIGNING_TOKEN = process.env.SLACK_SIGNING_TOKEN;
const PORT = process.env.NODE_PORT || 3000;

/**
 * Provide handling for whoson command. Allowed day options are handled by cases. Once date is calculated and formatted, 
 * querey website database for who is on. Returned result from website query is expected to be a string of riders. 
 * That is then posted as the message.
 */
app.post("/whoson", async ({ body: { token, text } }, res) => {
  if (token != SLACK_SIGNING_TOKEN) {
    res.send("Sorry, you're not authenticated!");
  }
  let done = false;
  if (text === "" || text.toLowerCase() === "today") {
    const { data } = await axios.get(
      `https://rpiambulance.com/slack-whoson.php?token=${RPIA_WEB_TOKEN}`
    );
    res.send(data);
  } else if (text.toLowerCase() === "week") {
    const { data } = await axios.get(
      `https://rpiambulance.com/slack-whoson.php?token=${RPIA_WEB_TOKEN}&week=1`
    );
    res.send(data);
  } else {
    const d = new Date();
    let o = new Date();
    let date = "";

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
        res.send("Please enter a valid day parameter and try again.");
        done = true;
    }

    if (!done) {
      const { data } = await axios.get(
        `https://rpiambulance.com/slack-whoson.php?token=${RPIA_WEB_TOKEN}&date=${date}`
      );
      res.send(data);
    }
  }
});

app.listen(PORT, () => {
  console.log(`whoson running on port ${PORT}`);
});
