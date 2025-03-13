const express = require("express");

const { getAllUsers } = require("../controllers/app.controllers");

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);

module.exports = usersRouter;
