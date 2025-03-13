const express = require("express");

const {
  getArticles,
  getCommentsByArticleID,
  getArticleByID,
  postCommentByArticleID,
  patchArticleByID,
} = require("../controllers/app.controllers");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleByID);
articlesRouter.get("/:article_id/comments", getCommentsByArticleID);
articlesRouter.post("/:article_id/comments", postCommentByArticleID);
articlesRouter.patch("/:article_id", patchArticleByID);

module.exports = articlesRouter;
