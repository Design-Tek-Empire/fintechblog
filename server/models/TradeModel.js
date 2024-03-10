const mongoose = require("mongoose")

const tradeSchema = new mongoose.Schema({
 proTrader: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
 },
 symbol: String,
 entryTime: String,
 endTime: String,
 stopLoss: Number,
 takeProfit: Number

}, {timestamps: true})


module.exports = mongoose.model("Trade", tradeSchema)