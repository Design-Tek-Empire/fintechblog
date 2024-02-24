const router = require("express").Router()

const commentController = require("../controllers/comment.Controller")
const {authenticateUser} = require("../middlewares/authorisation");


router.post("/create", commentController.createComment) // Create comment
router.put("/edit/:id", authenticateUser,  commentController.editComment); // Edit Comment and Update
router.delete("/delete/:id", authenticateUser, commentController.deleteComment) // delete manager
router.get("/all/:postId", commentController.viewAllComments); // view all Comments of a Particular post





module.exports = router