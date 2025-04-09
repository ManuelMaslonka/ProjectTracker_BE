const tagsController = require("../controller/tags.controller");
const {Router} = require("express");

const router = Router();

router.get("/", tagsController.getAll);
router.get("/:id/project", tagsController.getAvailableTags); // get all tags who can be added to a project


module.exports = router;
