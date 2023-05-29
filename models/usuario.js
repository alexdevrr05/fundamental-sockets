const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
  },

  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },

  image: {
    type: String,
    default:
      'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
  },

  rol: {
    type: String,
    required: true,
    enum: ['ADMIN_ROLE', 'USER_ROLE'],
  },

  estado: {
    type: Boolean,
    default: true,
  },

  google: {
    type: Boolean,
    default: false,
  },
});

/*
 Remueve __v y password al mostrar   
  res.json({
    usuario,
  }); 
*/

UsuarioSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  // De esta manera cambiamos visualmente el atributo _id por uid
  usuario.uid = _id;
  return usuario;
};

module.exports = model('Usuario', UsuarioSchema);
