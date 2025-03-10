const express = require("express");
const app = express();
const db = require("./db/connection.js");
const endpoints = require("./endpoints.json");
const { logAllEndpoints } = require("./controllers/app.controllers.js");

app.get("/api", logAllEndpoints);

module.exports = app;
