const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares");
const userController = require("../controllers/user")
// Signup Routes
router.get("/signup", userController.signupGetRoute);

router.post("/signup", wrapAsync(userController.signupPostRoute));

// Login Routes
router.get("/login", userController.loginGetRoute);

router.post("/login",saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), userController.loginPostRoute);

router.get("/logout",userController.logoutRoute)
module.exports = router;

