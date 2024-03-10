const { mustBeAdminOrPartner, authenticateUser } = require("../middlewares/authorisation")

const router = require("express").Router()

const tradeController = require("../controllers/trade.controller")



router.post("/create", authenticateUser, mustBeAdminOrPartner, tradeController.createSignal); // Create Signal
router.put("/edit/:id", authenticateUser, mustBeAdminOrPartner, tradeController.editSignal); // Edit Signal
router.get("/all", tradeController.getAll) // View All trade Signals
router.delete("/delete/:id", authenticateUser, mustBeAdminOrPartner, tradeController.deleteSignal) // delete signal




module.exports = router