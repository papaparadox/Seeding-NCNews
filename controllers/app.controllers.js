const endpoints = require("../endpoints.json");

function logAllEndpoints(request, response) {
  return response.status(200).send({ endpoints });
}

module.exports = { logAllEndpoints };
