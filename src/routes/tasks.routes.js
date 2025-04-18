const express = require("express");
const tasksController = require("../controller/tasks.controller")

const router = express.Router();

router.post("/", tasksController.create);
router.get("/", tasksController.findAll);
router.get("/user", tasksController.getForUser);
router.get("/:id", tasksController.findById);
router.post("/:id/assign", tasksController.assignTask);
router.patch("/:id", tasksController.update);
router.post("/:id/state/:state", tasksController.setState);


module.exports = router;
