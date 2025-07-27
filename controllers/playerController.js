const Player = require('../models/Player');

const getBalance = async (req, res) => {
  try {
    const { playerId } = req.params;
    const player = await Player.findById(playerId);
    res.json(player.wallet);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
};

module.exports = { getBalance };
