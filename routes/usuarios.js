const { Router } = require('express');

const { check } = require('express-validator');
const {
  usuariosGet,
  getUserDetails,
  usuariosDelete,
  usuariosPost,
} = require('../controllers/usuarios');
const { loadUserSession } = require('../middlewares/loadUserSession');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const { existeUsuarioPorId, emailExiste } = require('../helpers/db-validators');

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
router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check(
      'password',
      'El password es obligatorio y debe de tener mínimo 6 caracteres'
    )
      .isLength({ min: 6 })
      .not()
      .isEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom(emailExiste),
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    // check('rol').custom((rol) => esRoleValido(rol)),
    validarCampos,
  ],
  usuariosPost
);
module.exports = router;
