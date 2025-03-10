const endpoints = require("../endpoints.json");
const {
  selectAllTopics,
  selectArticleByID,
  selectAllArticles,
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
  if (isNaN(article_id)) {
    response.status(400).send({ status: 400, msg: "Invalid request" });
  }
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
module.exports = {
  sendAllEndpoints,
  getAllTopics,
  getArticleByID,
  getArticles,
};
