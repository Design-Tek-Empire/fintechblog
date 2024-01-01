const router = require("express").Router()
const dashController = require("../controllers/dash.contoller")
const { authenticateUser } = require("../middlewares/authorisation")

router.get("/dashboard",  authenticateUser,  dashController.dashboard);






module.exports = router