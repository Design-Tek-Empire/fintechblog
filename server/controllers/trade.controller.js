const logger = require("../../logger")

module.exports = {
  getAll: async (req, res) => {
    try {
      const trades = await Trade.find({}).sort({ createdAt: "desc" });

      if (trades.length > 0) {
        return res.status(200).json(trades);
      }
      res.status(204).json("No Current Signal");
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  createSignal: async (req, res) => {
    try {
      req.body.proTrader = req.session.user._id;
      const newSignal = await Trade.create(req.body);
      res.status(201).json(newSignal);
    } catch (err) {
      logger.error(err);
      res.status(500).json("Internal Server Error");
    }
  },

  editSignal: async (req, res) => {
    const currentUser = req.session.user;
    try {
      const tradeSignal = await Trade.findById(req.params.id);
      // Validate user
      if (currentUser._id !== tradeSignal.proTrader.toString()) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      await tradeSignal.updateOne(
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json("Signal Updated");
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  deleteSignal: async (req, res) => {
    const currentUser = req.session.user;
    try {
      const tradeSignal = await Trade.findById(req.params.id);
      // Validate user
      if (currentUser._id === tradeSignal.proTrader.toString() || currentUser.role === "Admin") {
         await tradeSignal.deleteOne();
         return res.status(200).json("Signal deleted");
      }

      return res.status(403).json({ error: "Unauthorized" });
     
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};