const express = require("express");
const app = express();
const db = require("./db/connection.js");
const endpoints = require("./endpoints.json");
const {
  sendAllEndpoints,
  getAllTopics,
  getArticleByID,
  getArticles,
  getCommentsByArticleID,
  postCommentByArticleID,
} = require("./controllers/app.controllers.js");
const {
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controllers.js");
app.use(express.json());

app.get("/api", sendAllEndpoints);
app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

app.post("/api/articles/:article_id/comments", postCommentByArticleID);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

app.all("/*", (request, response) => {
  response.status(404).send({ msg: "Not found" });
});

module.exports = app;
