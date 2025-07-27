const express = require('express');
const { getBalance } = require('../controllers/playerController');
const router = express.Router();

router.get('/balance/:playerId', getBalance);
router.post('/create', async (req, res) => {
  const Player = require('../models/Player');
  const newPlayer = new Player({
    username: 'Joshna',
    wallet: {
      BTC: 0.002,
      ETH: 0.03
    }
  });
  await newPlayer.save();
  res.json(newPlayer);
});


module.exports = router;
