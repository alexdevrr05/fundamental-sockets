const express = require('express');
const cors = require('cors');

const { json } = require('express');
const { socketController } = require('../sockets/controller');
const { connectDatabase } = require('../databases/config');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io')(this.server);

    this.authPath = '/api/auth';

    this.conectarDB();
    this.middlewares();
    this.routes();
    this.sockets();
  }

  async conectarDB() {
    await connectDatabase();
  }

  middlewares() {
    // CORS
    this.app.use(cors());
    this.app.use(json());
    // Directorio Público
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.authPath, require('../routes/auth'));
  }

  sockets() {
    this.io.on('connection', (socket) => {
      socketController(socket);
      const ipAddress = socket.handshake.address; // Obtiene la dirección IP del cliente

      console.log('ipAddress ->', ipAddress);
    });
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log('Server run on port: ', this.port);
    });
  }
}

module.exports = Server;
