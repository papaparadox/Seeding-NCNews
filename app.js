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
  patchArticleByID,
  removeCommentByID,
  getAllUsers,
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
app.get("/api/users", getAllUsers);

app.post("/api/articles/:article_id/comments", postCommentByArticleID);

app.patch("/api/articles/:article_id", patchArticleByID);

app.delete("/api/comments/:comment_id", removeCommentByID);

app.all("/*", (request, response) => {
  return response.status(404).send({ msg: "Not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;
