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
app.use('/api/player', require('./routes/playerRoutes'));


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  });
