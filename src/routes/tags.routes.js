const tagsController = require("../controller/tags.controller");
const {Router} = require("express");

const router = Router();

router.get("/", tagsController.getAll);


module.exports = router;
