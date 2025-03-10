const endpoints = require("../endpoints.json");
const { selectAllTopics } = require("../models/app.models");

function sendAllEndpoints(request, response) {
  return response.status(200).send({ endpoints });
}

function getAllTopics(request, response) {
  selectAllTopics()
    .then((topics) => {
      response.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
}
module.exports = { sendAllEndpoints, getAllTopics };
