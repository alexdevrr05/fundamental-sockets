const express = require('express');
const cors = require('cors');
const { json } = require('express');
const { socketController } = require('../sockets/controller');
const { connectDatabase } = require('../databases/config');

const UAParser = require('ua-parser-js');
const parser = new UAParser();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io')(this.server, {
      cors: {
        origin: 'http://localhost:8080',
      },
    });
    this.usuariosPath = '/api/usuarios';
    this.authPath = '/api/auth';

    this.connectedUsers = [];

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
    this.app.use(this.usuariosPath, require('../routes/usuarios'));
    this.app.use(this.authPath, require('../routes/auth'));
  }

  sockets() {
    this.io.on('connection', (socket) => {
      socketController(socket);

      const userAgent = socket.request.headers['user-agent'];
      const result = parser.setUA(userAgent).getResult();
      const ipAddress = socket.handshake.address;
      const socketId = socket.id;
      const navegador = result.browser.name;
      const os = result.os.name;
      const device = result.device.vendor;

      const connectedUser = {
        socketId,
        isConnected: true,
        ipAddress,
        navegador,
        os,
        dispositivo: device,
        anchoBanda: 0, // Se inicializa con un valor de ancho de banda de 0
      };

      this.connectedUsers.push(connectedUser);

      // Enviar la lista actualizada de usuarios conectados a todos los clientes
      this.io.emit('users', this.connectedUsers);

      // Escucha eventos de transferencia de datos del cliente al servidor
      socket.on('dataTransfer', (data) => {
        const dataSize = data.dataSize;
        const transferTime = data.transferTime;

        const bandwidth = dataSize / transferTime;

        // Actualizar el ancho de banda del usuario correspondiente en la lista
        const userIndex = this.connectedUsers.findIndex(
          (user) => user.socketId === socketId
        );
        if (userIndex !== -1) {
          this.connectedUsers[userIndex].anchoBanda = bandwidth.toFixed(2);
        }

        // Enviar la lista actualizada de usuarios conectados a todos los clientes
        this.io.emit('users', this.connectedUsers);
      });

      // Escucha eventos de desconexión del usuario
      socket.on('disconnect', () => {
        // Buscar el usuario en la lista por su socketId
        const userIndex = this.connectedUsers.findIndex(
          (user) => user.socketId === socketId
        );

        if (userIndex !== -1) {
          // Marcar al usuario como desconectado
          this.connectedUsers[userIndex].isConnected = false;

          // Eliminar al usuario de la lista
          this.connectedUsers.splice(userIndex, 1);

          // Enviar la lista actualizada de usuarios conectados a todos los clientes
          this.io.emit('users', this.connectedUsers);
        }
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
