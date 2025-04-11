const express = require("express");
const usersController = require("../controller/users.controller");

const router = express.Router();

router.get("/", usersController.getAll);
router.get("/user", usersController.getUser);
router.get('/:projectId', usersController.getAvailableUsersToAdd);
router.get('/:id/available/:taskId', usersController.getAvailableUsersToAssignTask);
router.post("/", usersController.create);
router.post('/:id/role', usersController.addRole);
router.patch("/:id", usersController.updateProfile);
// router.get("/:id", usersController.getById);

module.exports = router;
