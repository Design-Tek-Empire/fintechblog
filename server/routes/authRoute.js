const router = require("express").Router();
const {usernameToLowerCase,  ensureGuest} = require("../middlewares/authorisation");

const authController = require("../controllers/auth.controller")

// GET PAGES
router.get("/register", ensureGuest, authController.registerPage); // get Reg. Page
router.post("/register", usernameToLowerCase, authController.register); // Create User
router.get("/login", ensureGuest,  authController.loginPage ) // get Reg. Page
router.post("/login", usernameToLowerCase, authController.login ) // Actuall Login
router.get("/logout", authController.logout)



module.exports = router;
