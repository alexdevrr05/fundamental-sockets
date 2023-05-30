const { Router } = require('express');

const { check } = require('express-validator');
const {
  usuariosGet,
  getUserDetails,
  usuariosDelete,
} = require('../controllers/usuarios');
const { loadUserSession } = require('../middlewares/loadUserSession');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const { existeUsuarioPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/userDetails/:id', getUserDetails);
router.get('/', usuariosGet);
router.get('/loadUserSession', [loadUserSession]);
router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos,
  ],

  usuariosDelete
);
module.exports = router;
