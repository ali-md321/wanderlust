const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/userController.js");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(userController.userSignup)

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,
        passport.authenticate("local",{failureRedirect : "/login",failureFlash : true}),
        userController.userLogin
    )

router.get("/logout",userController.userLogout)

module.exports = router;