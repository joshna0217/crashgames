const Round = require('../models/Round');
const Player = require('../models/Player');
const Transaction = require('../models/Transaction');
const { getCryptoPrice } = require('../utils/cryptoPrice');
const { v4: uuidv4 } = require('uuid');
const { generateCrashPoint } = require('../utils/crashPoint');

let currentRound = null;

const startNewRound = async (io) => {
  const roundId = uuidv4();
  const seed = uuidv4();
  const crashPoint = parseFloat(generateCrashPoint(seed, roundId));
  currentRound = {
    roundId,
    crashPoint,
    multiplier: 1.0,
    startTime: Date.now(),
    bets: [],
    seed
  };

  const roundDoc = new Round({
    roundId,
    crashPoint,
    seed,
    bets: []
  });
  await roundDoc.save();

  io.emit('round_start', { roundId, crashPoint });

  const interval = setInterval(async () => {
    const elapsed = (Date.now() - currentRound.startTime) / 1000;
    currentRound.multiplier = parseFloat((1 + elapsed * 0.1).toFixed(2));
    io.emit('multiplier_update', currentRound.multiplier);

    if (currentRound.multiplier >= crashPoint) {
      clearInterval(interval);
      io.emit('round_crash', crashPoint);
      currentRound = null;
    }
  }, 100);
};

const placeBet = async (req, res) => {
  try {
    const { playerId, usdAmount, currency } = req.body;
    const price = await getCryptoPrice(currency);
    const cryptoAmount = usdAmount / price;

    const player = await Player.findById(playerId);
    if (!player || player.wallet[currency] < cryptoAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    player.wallet[currency] -= cryptoAmount;
    await player.save();

    const tx = new Transaction({
      playerId,
      usdAmount,
      cryptoAmount,
      currency,
      transactionType: 'bet',
      transactionHash: uuidv4(),
      priceAtTime: price
    });
    await tx.save();

    const round = await Round.findOne({ roundId: currentRound.roundId });
    round.bets.push({ playerId, usdAmount, cryptoAmount, currency, cashout: false });
    await round.save();

    res.json({ message: 'Bet placed', cryptoAmount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to place bet' });
  }
};

const cashOut = async (req, res) => {
  try {
    const { playerId } = req.body;
    const round = await Round.findOne({ roundId: currentRound.roundId });

    const playerBet = round.bets.find(b => b.playerId.toString() === playerId && !b.cashout);
    if (!playerBet || currentRound.multiplier >= currentRound.crashPoint) {
      return res.status(400).json({ error: 'Cashout failed or too late' });
    }

    const payoutCrypto = playerBet.cryptoAmount * currentRound.multiplier;
    const price = await getCryptoPrice(playerBet.currency);
    const payoutUSD = payoutCrypto * price;

    const player = await Player.findById(playerId);
    player.wallet[playerBet.currency] += payoutCrypto;
    await player.save();

    playerBet.cashout = true;
    playerBet.multiplierAtCashout = currentRound.multiplier;
    await round.save();

    const tx = new Transaction({
      playerId,
      usdAmount: payoutUSD,
      cryptoAmount: payoutCrypto,
      currency: playerBet.currency,
      transactionType: 'cashout',
      transactionHash: uuidv4(),
      priceAtTime: price
    });
    await tx.save();

    res.json({ message: 'Cashed out', payoutCrypto, payoutUSD });
  } catch (err) {
    res.status(500).json({ error: 'Cashout error' });
  }
};

module.exports = { startNewRound, placeBet, cashOut };
