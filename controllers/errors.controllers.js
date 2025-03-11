exports.handleCustomErrors = (err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.handlePsqlErrors = (err, request, response, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    response.status(400).send({ status: 400, msg: "Invalid request" });
  }
  if (err.code === "23503") {
    response.status(404).send({ status: 404, msg: "Not found" });
  }
  next(err);
};
