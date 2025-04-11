const express = require("express");
const publicController = require("../controller/public.controller")

const router = express.Router();

router.post("/register", publicController.register);
router.post("/login", publicController.login);


module.exports = router;
