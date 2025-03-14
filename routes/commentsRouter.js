const express = require("express");

const {
  removeCommentByID,
  patchCommentByID,
} = require("../controllers/app.controllers");

const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", removeCommentByID);
commentsRouter.patch("/:comment_id", patchCommentByID);

module.exports = commentsRouter;
