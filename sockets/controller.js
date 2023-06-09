const socketController = (socket) => {
  // socket.on('disconnect', () => {
  //   console.log('Cliente desconectado', socket.id);
  // });

  // con broadcast todos reciben el mensaje, menos el que lo emite
  socket.on('enviar-mensaje', (payload) => {
    socket.broadcast.emit('enviar-mensaje', payload);
  });

  // socket.emit('users', Object.keys(connectedUsers));
};

module.exports = {
  socketController,
};
