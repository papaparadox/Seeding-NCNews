exports.handleCustomErrors = (err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  }
  next(err);
};
