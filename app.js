const express = require("express");
const app = express();
const db = require("./db/connection.js");
const endpoints = require("./endpoints.json");
const {
  sendAllEndpoints,
  getAllTopics,
} = require("./controllers/app.controllers.js");

app.get("/api", sendAllEndpoints);

app.get("/api/topics", getAllTopics);

app.all("/*", (request, response) => {
  response.status(400).send({ msg: "Invalid request" });
});

module.exports = app;
