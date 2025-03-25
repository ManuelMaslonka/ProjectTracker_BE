const express = require("express");
const publicController = require("../controller/public.controller")

const router = express.Router();

router.post("/sign-up", publicController.signUp);
router.post("/sign-in", publicController.signIn);


module.exports = router;
