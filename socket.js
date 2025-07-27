const socketIO = require('socket.io');
const { startNewRound } = require('./controllers/gameController');

module.exports = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('cashout', async (data) => {
      // Optional: handle real-time cashout request
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  

  // Start a new game round every 10 seconds
  setInterval(() => {
    startNewRound(io);
  }, 10000);

  return io;
};
