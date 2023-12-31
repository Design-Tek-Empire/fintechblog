const router = require('express').Router()

const catController = require('../controllers/cat.controller')
const {authenticateUser,isAdminOrEditor, } = require("../middlewares/middleware");


router.get("/", catController.viewAll); // view categories
router.get("/create",authenticateUser,isAdminOrEditor,catController.createPage); // get add new page
router.post("/create",authenticateUser,isAdminOrEditor,catController.createCategory) // create category
router.get("/:id", catController.viewOneCategory) // view one category
router.get("/edit/:id",authenticateUser,isAdminOrEditor,catController.editcatpage); // edit category page
router.put("/edit/:id",authenticateUser,isAdminOrEditor,catController.editCategory); // edit category
router.delete("/delete/:id",authenticateUser,isAdminOrEditor,catController.deletecat) // delete category




module.exports = router