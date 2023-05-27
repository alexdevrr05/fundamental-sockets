const express = require('express');
const cors = require('cors');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io')(this.server);

    this.paths = {};

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();

    // Sockets
    this.sockets();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Directorio Público
    this.app.use(express.static('public'));
  }

  routes() {}
  sockets() {
    this.io.on('connection', (socket) => {
      socket.on('disconnect', () => {
        console.log('Cliente desconectado');
      });

      socket.on('enviar-mensaje', (payload) => {
        console.log(payload);
      });
    });
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log('Server run on port: ', this.port);
    });
  }
}

module.exports = Server;
