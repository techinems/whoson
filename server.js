//node packages
const express = require("express");
const axios = require("cachios");
const bodyParser = require("body-parser");
require("dotenv").config();

//local packages
const { getDate } = require("./utilities/helpers.js");

//node package config
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//globals
const RPIA_WEB_TOKEN = process.env.RPIA_WEB_TOKEN;
const SLACK_SIGNING_TOKEN = process.env.SLACK_SIGNING_TOKEN;
const PORT = process.env.NODE_PORT || 3000;

const whoson = async(t) => {
  const url = `https://rpiambulance.com/slack-whoson.php?token=${RPIA_WEB_TOKEN}`;

  if (t === "" || t === "today" || t === "week") {
    const addlQuery = t === "week" ? "&week=1" : "";
    const { data } = await axios.get(url + addlQuery);
    return data;
  }

  const date = getDate(t);
  if (!date) return null;
  const { data } = await axios.get(`${url}&date=${date}`);
  return data;
};

app.post("/whoson", async ({ body: { token, text } }, res) => {
  if (token !== SLACK_SIGNING_TOKEN) return res.sendStatus(401);
  whoson(text.toLowerCase()).then(result => {
    res.send(result || "Please enter a valid day and try again.");
  })
});

app.listen(PORT, () => console.log(`whoson running on port ${PORT}`));
