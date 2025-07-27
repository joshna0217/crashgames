# 🎮 Crypto Crash Game Backend

This is the backend for a real-time multiplayer **Crypto Crash Game**, where players bet using USD, watch a multiplier increase, and try to cash out before the game crashes. The bet amount is converted to real-time cryptocurrency (BTC or ETH), and winnings are calculated based on live price and multiplier.

---

## 🔧 Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **Socket.IO** for real-time updates
- **CoinGecko API** for live crypto prices

---

## 🧩 How the Game Works

1. A game round starts every **10 seconds**.
2. Players place bets in **USD**, choosing either BTC or ETH.
3. The game starts with a **multiplier of 1.00x**, increasing every 100ms.
4. The game randomly **crashes** at a point between 1x and 120x.
5. Players can **cash out** before the crash to win. If they don’t, they lose the bet.
6. Winnings are calculated in crypto, based on the multiplier and real-time price.

---

## 🚀 Features

### 🎲 Game Logic
- Provably fair crash algorithm using `SHA-256(seed + roundId)`
- Multiplier increases with time
- Rounds start automatically every 10 seconds
- Round data, crash point, and bets stored in MongoDB

### 💰 Crypto Integration
- Fetches BTC/ETH prices in real-time from CoinGecko
- USD to crypto conversion at time of bet
- Player wallets store BTC/ETH balances
- All transactions are recorded with price, hash, and timestamps

### 🌐 WebSockets
- Emits real-time events to all connected players:
  - `round_start`
  - `multiplier_update`
  - `round_crash`
- Future support for real-time `cashout` from clients

---

## 🔌 API Endpoints

### 🧍 Player Routes
Description 
| POST   | `/api/player/create`             
| Create a new player       |
| GET    | `/api/player/balance/:playerId`  
| Get player wallet balances|

### 🎮 Game Routes
| Method | Endpoint              | Description             |
| POST   | `/api/game/bet`       | Place a USD bet         |
| POST   | `/api/game/cashout`   | Cash out before crash   

## 🔧 Setup Instructions

### 1. Clone and Install
```bash
git clone 
cd crypto-crash-game
npm install

create a player

**POST /api/player/create
{
  "username": "Joshna"
}

**place a bet

##POST /api/game/bet
{
  "playerId": "64f123abc456def...",
  "usdAmount": 10,
  "currency": "BTC"
}

##project structure

├── controllers/
│   ├── gameController.js
│   ├── playerController.js
├── models/
│   ├── Player.js
│   ├── Round.js
│   └── Transaction.js
├── routes/
│   ├── gameRoutes.js
│   └── playerRoutes.js
├── utils/
│   ├── cryptoPrice.js
│   └── crashPoint.js
├── socket.js
├── server.js
└── .env


