const express = require("express");
const app = express();
const db = require("./db/connection.js");
const endpoints = require("./endpoints.json");
const { sendAllEndpoints } = require("./controllers/app.controllers.js");
const {
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controllers.js");
const apiRouter = require("./routes/api-router.js");

app.use(express.json());
app.use("/api", apiRouter);
app.get("/api", sendAllEndpoints);

app.all("/*", (request, response) => {
  return response.status(404).send({ msg: "Not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;
