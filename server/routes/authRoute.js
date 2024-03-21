const router = require("express").Router();
const {usernameToLowerCase} = require("../middlewares/authorisation");

const authController = require("../controllers/auth.controller")



router.post("/register", usernameToLowerCase, authController.register); // Create User
router.post("/login", usernameToLowerCase, authController.login ) // Actuall Login
router.post("/forgotpassword", authController.forgotpassword )// Request for password Reset
router.post("/verifyotp", authController.verifyotp )// Request for password Reset
router.post("/resetpassword/:id", authController.resetpassword )// Set New password
router.get("/logout", authController.logout)



module.exports = router;
