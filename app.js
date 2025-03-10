const express = require("express");
const app = express();
const db = require("./db/connection.js");
const endpoints = require("./endpoints.json");
const {
  sendAllEndpoints,
  getAllTopics,
  getArticleByID,
  getArticles,
} = require("./controllers/app.controllers.js");
const { handleCustomErrors } = require("./controllers/errors.controllers.js");

app.get("/api", sendAllEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles", getArticles);

app.all("/*", (request, response) => {
  response.status(404).send({ msg: "Not found" });
});

app.use(handleCustomErrors);
module.exports = app;
