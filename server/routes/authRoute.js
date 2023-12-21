const router = require("express").Router();
// const transporter = require("../middlewares/utils");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const passport = require("passport");
const {
  usernameToLowerCase,
  ensureLoggedin,
  ensureGuest,
} = require("../middlewares/middleware");

const authController = require("../controllers/auth.controller")


// GET PAGES
router.get("/register", ensureGuest, authController.register ) // get Reg. Page
router.get("/login", ensureGuest, authController.login ) // get Reg. Page


// POST REQUESTS

router.post("/register", usernameToLowerCase, authController.createAccount); // Create User
router.post("/login", ensureGuest, usernameToLowerCase, authController.signIn ) // Actuall Login



module.exports = router;
