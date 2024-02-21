const router = require("express").Router();
const {usernameToLowerCase,  ensureGuest} = require("../middlewares/authorisation");

const authController = require("../controllers/auth.controller")


router.post("/register", usernameToLowerCase, authController.register); // Create User
router.post("/login", usernameToLowerCase, authController.login ) // Actuall Login
router.get("/logout", authController.logout)



module.exports = router;
