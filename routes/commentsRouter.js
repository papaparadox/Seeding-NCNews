const express = require("express");

const { removeCommentByID } = require("../controllers/app.controllers");

const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", removeCommentByID);

module.exports = commentsRouter;
