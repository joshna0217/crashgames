
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketSetup = require('./socket');
const gameRoutes = require('./routes/gameRoutes');
const playerRoutes = require('./routes/playerRoutes');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketSetup(server);

app.use(express.json());
app.use('/api/game', gameRoutes);
app.use('/api/player', playerRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
