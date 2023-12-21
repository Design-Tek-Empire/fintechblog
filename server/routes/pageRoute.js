const router = require("express").Router()

const pageContoller = require("../controllers/page.controller")



router.get("/", pageContoller.homepage) // Landing Page
router.get("/about-us", pageContoller.aboutPage)


module.exports = router