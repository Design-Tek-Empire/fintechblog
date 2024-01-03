const router = require("express").Router()
const userController = require("../controllers/user.controller")
const { mustBeAdmin , authenticateUser,  authorizedUser} = require("../middlewares/authorisation");
const { compressImg } = require("../middlewares/cloudinary");



 router.post("/create", mustBeAdmin, userController.createUser); // Create User
 router.get("/allUsers", mustBeAdmin, userController.viewAllUsers)  // Get All Users
 router.get("/user/:id", userController.singleUser); // Single User
 router.put("/edit/:id", authenticateUser, authorizedUser,compressImg,userController.editUser ); // Edit User
 router.delete("/delete/:id",authenticateUser,authorizedUser , userController.deleteUser ) //Delete User






module.exports = router