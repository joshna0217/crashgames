const express = require('express');
const { placeBet, cashOut } = require('../controllers/gameController');
const router = express.Router();

router.post('/bet', placeBet);
router.post('/cashout', cashOut);

module.exports = router;
