const endpoints = require("../endpoints.json");
const {
  selectAllTopics,
  selectArticleByID,
  selectAllArticles,
  selectCommentsByID,
  insertCommentByID,
} = require("../models/app.models");

function sendAllEndpoints(request, response) {
  return response.status(200).send({ endpoints });
}

function getAllTopics(request, response, next) {
  selectAllTopics()
    .then((topics) => {
      response.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticleByID(request, response, next) {
  const { article_id } = request.params;
  selectArticleByID(article_id)
    .then((article) => {
      response.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticles(request, response, next) {
  selectAllArticles()
    .then((articles) => {
      response.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
}

function getCommentsByArticleID(request, response, next) {
  const { article_id } = request.params;
  selectCommentsByID(article_id)
    .then((comment) => {
      response.status(200).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
}

function postCommentByArticleID(request, response, next) {
  const { article_id } = request.params;
  const { username, body } = request.body;
  insertCommentByID(article_id, username, body)
    .then((comment) => {
      response.status(201).send({ newComment: comment });
    })
    .catch((err) => {
      next(err);
    });
}
module.exports = {
  sendAllEndpoints,
  getAllTopics,
  getArticleByID,
  getArticles,
  getCommentsByArticleID,
  postCommentByArticleID,
};
