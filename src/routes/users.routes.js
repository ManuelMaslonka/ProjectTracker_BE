const express = require("express");
const usersController = require("../controller/users.controller");

const router = express.Router();

router.get("/", usersController.getAll);
router.get("/user", usersController.getUser);
// router.get("/:id", usersController.getById);

module.exports = router;
