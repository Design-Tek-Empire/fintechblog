const router = require("express").Router()

const postController = require("../controllers/post.controller")
const {
  authenticateUser,
  isAdminOrEditor,
  isAuthorized,
} = require("../middlewares/middleware");



router.get("/create", authenticateUser, isAdminOrEditor, postController.createPostPage)
router.post("/create", authenticateUser, isAdminOrEditor, postController.createPost)
router.get("/edit/:id",authenticateUser,isAuthorized,postController.editPostPage);
router.put("/edit/:id", authenticateUser, isAuthorized, postController.editPost);
router.delete("/delete/:id", authenticateUser, isAuthorized,postController.deletePost)
router.get("/all", postController.viewAllPosts);
router.get("/:slug", postController.viewSinglePost);


module.exports = router