const express = require("express");
const tasksController = require("../controller/tasks.controller");
const upload = require("../utils/multer.config");

const router = express.Router();

router.post("/", upload.single('image'), tasksController.create);
router.get("/", tasksController.findAll);
router.get("/user", tasksController.getForUser);
router.get("/:id", tasksController.findById);
router.delete("/:id", tasksController.deleteTask);
router.post("/:id/assign", tasksController.assignTask);
router.patch("/:id", upload.single('image'), tasksController.update);
router.post("/:id/state/:state", tasksController.setState);
router.post("/:id/log-hours", tasksController.logHours);
router.post("/:id/upload-image", upload.single('image'), tasksController.uploadImage);


module.exports = router;

