const { Router } = require('express');

const { usuariosGet, getUserDetails } = require('../controllers/usuarios');
const { loadUserSession } = require('../middlewares/loadUserSession');
const router = Router();

router.get('/userDetails/:id', getUserDetails);
router.get('/', usuariosGet);
router.get('/loadUserSession', [loadUserSession]);

module.exports = router;
