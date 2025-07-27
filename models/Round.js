const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  roundId: String,
  crashPoint: Number,
  seed: String,
  bets: [
    {
      playerId: mongoose.Schema.Types.ObjectId,
      usdAmount: Number,
      cryptoAmount: Number,
      currency: String,
      multiplierAtCashout: Number,
      cashout: Boolean
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Round', roundSchema);
