const { request, response } = require('express');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

const loadUserSession = async (req = request, res = response, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'No se ha mandado el token en la petición',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Leer al usuario que corresponde al uid
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: 'Token no válido - usuario no existe en DB',
      });
    }

    // Verificar si el usuario tiene estado true
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Token no válido - usuario con estado: false',
      });
    }

    req.usuario = usuario;

    res.json({
      usuario,
      token,
    });
    next(); // Mover esta línea antes de res.json()
  } catch (error) {
    console.log(error);
    res.status(401).send({
      msg: 'Token no válido',
    });
  }
};

module.exports = {
  loadUserSession,
};
