const crypto = require('crypto');

function generateCrashPoint(seed, roundNumber) {
  const hash = crypto.createHash('sha256').update(seed + roundNumber).digest('hex');
  const intVal = parseInt(hash.slice(0, 8), 16);
  const maxCrash = 120;
  return Math.max(1, (intVal % (maxCrash * 100)) / 100).toFixed(2);
}

module.exports = { generateCrashPoint };
