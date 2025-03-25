const express = require("express");
const projectsController = require("../controller/projects.controller")

const router = express.Router();

router.get("/", projectsController.get);
router.post("/", projectsController.create);
router.get("/user", projectsController.getForUser);
router.delete("/:id", projectsController.remove);
router.get("/:id", projectsController.getById);
router.patch("/:id", projectsController.update);
router.post("/:id/tag", projectsController.addTag);
router.delete("/:id/tag", projectsController.removeTag);
router.post("/:id/task", projectsController.addTask);
router.post("/:id/member", projectsController.addMember);
router.post("/:id/status/:status", projectsController.setStatus);

module.exports = router;
