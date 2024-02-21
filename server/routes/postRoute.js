const router = require("express").Router()

const postController = require("../controllers/post.controller")
const {authenticateUser, mustBeAdmin, isAdminOrEditor} = require("../middlewares/authorisation");
const { compressImg } = require("../middlewares/cloudinary")


router.post("/create", authenticateUser,compressImg, postController.createPost) // Create Post
router.put("/approve/:id", authenticateUser,isAdminOrEditor, postController.approvePost); //Approve a post
router.put("/edit/:id", authenticateUser,  postController.editPost); // Edit Post and Update
router.delete("/delete/:id", authenticateUser, postController.deletePost) // delete manager
router.put("/restore/:id", mustBeAdmin, postController.restoreDeletedPost) // Restore deleted Post
router.get("/", postController.viewAllPosts); // view all Posts
router.get("/:slug", postController.viewSinglePost);



module.exports = router