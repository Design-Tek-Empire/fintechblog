const router = require("express").Router()

const postController = require("../controllers/post.controller")
const {authenticateUser,isAdminOrEditor} = require("../middlewares/middleware");



router.get("/create", authenticateUser, isAdminOrEditor, postController.createPostPage)
router.post("/create", authenticateUser, isAdminOrEditor, postController.createPost)
router.get("/edit/:slug",authenticateUser,postController.editPostPage);
router.put("/edit/:slug", authenticateUser,  postController.editPost);
router.delete("/delete/:id", authenticateUser, postController.deletePost)
router.get("/all", postController.viewAllPosts);
router.get("/:slug", postController.viewSinglePost);


module.exports = router