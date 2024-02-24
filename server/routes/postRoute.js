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
router.get("/:id", postController.viewSinglePost); // view Single Post
router.post("/like", authenticateUser, postController.likePost);
router.post("/bookmark", authenticateUser, postController.bookmark); // Bookmark a post
router.get("/bookmark/:userId", authenticateUser, postController.userBookmarks); // Get a User's all bookmarks



module.exports = router