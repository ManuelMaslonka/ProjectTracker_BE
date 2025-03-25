const express = require("express");
const usersController = require("../controller/users.controller");

const router = express.Router();

router.get("/", usersController.getAll);

module.exports = router;
