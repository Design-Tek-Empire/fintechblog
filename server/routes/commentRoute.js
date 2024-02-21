const router = require("express").Router()

const commentController = require("../controllers/comment.Controller")
const {authenticateUser, mustBeAdmin, isAdminOrEditor} = require("../middlewares/authorisation");



router.post("/create", authenticateUser, commentController.createComment) // Create comment

// router.put("/:id", authenticateUser,  commentController.editComment); // Edit Comment and Update
// router.delete("/:id", authenticateUser, commentController.deleteComment) // delete manager
// router.get("/", commentController.viewAllComments); // view all Comments
// router.get("/:slug", commentController.viewSingleComment);






module.exports = router