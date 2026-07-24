//node packages
const crypto = require("crypto");
const express = require("express");
require("dotenv").config();

//local packages
const { resolveWhosonQuery } = require("./utilities/helperFunctions.js");

//node package config
const app = express();
// Capture the raw request body so we can verify Slack's request signature,
// which is an HMAC computed over the exact bytes Slack sent.
const captureRawBody = (req, res, buf) => {
  req.rawBody = buf;
};
app.use(express.urlencoded({ extended: false, verify: captureRawBody }));
app.use(express.json({ verify: captureRawBody }));

//globals
const BASE_URL = process.env.BASE_URL;
const RPIA_WEB_TOKEN = process.env.RPIA_WEB_TOKEN;
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const PORT = process.env.NODE_PORT || 3000;
const UPSTREAM_TIMEOUT_MS = 10000;

// Verify the request actually came from Slack using signing-secret HMAC
// (replaces the deprecated verification-token check). See:
// https://api.slack.com/authentication/verifying-requests-from-slack
const verifySlackSignature = (req, res, next) => {
  const timestamp = req.get("X-Slack-Request-Timestamp");
  const signature = req.get("X-Slack-Signature");

  if (!SLACK_SIGNING_SECRET) {
    console.error("SLACK_SIGNING_SECRET is not configured.");
    return res.status(500).send("Server auth is not configured.");
  }
  if (!timestamp || !signature) {
    return res.status(401).send("Sorry, you're not authenticated!");
  }
  // Reject requests older than 5 minutes to guard against replay attacks.
  const fiveMinutes = 60 * 5;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > fiveMinutes) {
    return res.status(401).send("Sorry, you're not authenticated!");
  }

  const base = `v0:${timestamp}:${req.rawBody ? req.rawBody.toString("utf8") : ""}`;
  const expected =
    "v0=" +
    crypto
      .createHmac("sha256", SLACK_SIGNING_SECRET)
      .update(base)
      .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).send("Sorry, you're not authenticated!");
  }
  next();
};

// Fetch text/JSON from the crew schedule backend with a hard timeout.
// Mirrors the previous axios behavior: JSON responses are passed through as
// objects (Express serializes them), everything else as text.
const fetchUpstream = async query => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const url = `${BASE_URL}?token=${RPIA_WEB_TOKEN}${query}`;
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Upstream responded ${response.status}`);
    }
    const contentType = response.headers.get("content-type") || "";
    return contentType.includes("application/json")
      ? await response.json()
      : await response.text();
  } finally {
    clearTimeout(timer);
  }
};

app.get("/health", (req, res) => res.status(200).send("ok"));

app.post("/whoson", verifySlackSignature, async (req, res) => {
  const resolved = resolveWhosonQuery(req.body.text);

  if (resolved.type === "invalid") {
    return res.send("Please enter a valid day parameter and try again.");
  }

  let query = "";
  if (resolved.type === "week") {
    query = "&week=1";
  } else if (resolved.type === "date") {
    query = `&date=${resolved.date}`;
  }

  try {
    const data = await fetchUpstream(query);
    res.send(data);
  } catch (err) {
    console.error("Failed to fetch crew schedule:", err.message);
    res.send(
      "Sorry, the crew schedule is unavailable right now. Try again shortly."
    );
  }
});

app.listen(PORT, () => {
  console.log(`whoson running on port ${PORT}`);
});
