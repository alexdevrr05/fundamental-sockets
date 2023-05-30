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
      // console.log('Cliente conectado desde:', result);

      const ipAddress = socket.handshake.address; // Obtiene la dirección IP del cliente
      const socketId = socket.id;
      const navegador = result.browser.name;
      const os = result.os.name;
      const device = result.device.vendor;

      // Almacenar la información del usuario conectado
      this.connectedUsers.push({
        socketId,
        isConnected: true,
        ipAddress,
        navegador,
        os,
        dispositivo: device,
      });

      // Acciones cuando un usuario se conecta

      // Enviar la lista de usuarios conectados a todos los clientes
      this.io.emit('users', this.connectedUsers);

      // Escuchar eventos de desconexión del usuario
      socket.on('disconnect', () => {
        // Buscar el usuario en el array
        const index = this.connectedUsers.findIndex(
          (user) => user.socketId === socketId
        );

        if (index !== -1) {
          // Actualizar el estado del usuario a desconectado
          this.connectedUsers[index].isConnected = false;

          // Eliminar al usuario del array

          this.connectedUsers.splice(index, 1);

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
