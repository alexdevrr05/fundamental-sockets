const { request, response } = require('express');

const Usuario = require('../models/usuario');

const getUserDetails = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);

    res.json({ usuario });
  } catch (error) {
    res.json({ error });
  }
};

const usuariosGet = async (req = request, res = response) => {
  // const { limite = 5, desde = 0 } = req.query;
  // Solo quiero mostrar los usuarios que estén activos
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([Usuario.find(query)]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosDelete = async (req = request, res = response) => {
  // Lo borramos fisicamente
  // const usuario = await Usuario.findByIdAndDelete(id);

  /**
   * Es más recomendable pasar el registro a false
   * que borrarlo fisicamente
   */
  const { id } = req.params;

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json({
    usuario,
  });
};

module.exports = {
  getUserDetails,
  usuariosGet,
  usuariosDelete,
};
