const router = require("express").Router()

const postController = require("../controllers/post.controller")
const {authenticateUser,isAdminOrEditor,mustbeAdmin} = require("../middlewares/authorisation");
const { compressImg } = require("../middlewares/cloudinary")



router.get("/create", authenticateUser, isAdminOrEditor, postController.createPostPage)
router.post("/create", authenticateUser, isAdminOrEditor,compressImg, postController.createPost)
router.get("/edit/:slug",authenticateUser,postController.editPostPage);
router.put("/edit/:slug", authenticateUser,  postController.editPost);
router.delete("/delete/:id", authenticateUser, postController.deletePost)
router.get("/all", postController.viewAllPosts);
router.get("/pending",  mustbeAdmin, postController.pendingPosts)
router.get("/:slug", postController.viewSinglePost);
router.put("/approve/:id",  mustbeAdmin, postController.approvePost)


module.exports = router