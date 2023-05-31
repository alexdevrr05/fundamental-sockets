const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post(
  '/login',
  [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La password es obligatoria').not().isEmpty(),
    validarCampos,
  ],
  login
);

router.get('/download', (req, res) => {
  const fileSize = 1024 * 1024 * 10; // Tamaño del archivo en bytes (10 MB)

  // Inicia el temporizador
  const startTime = process.hrtime();

  // Genera un archivo de prueba con datos aleatorios
  const buffer = Buffer.alloc(fileSize, 'x');
  
  // Simula el envío del archivo al cliente
  res.attachment('test-file.bin');
  res.send(buffer);

  // Calcula el tiempo de transferencia
  const endTime = process.hrtime(startTime);
  const transferTime = endTime[0] + endTime[1] / 1e9; // Tiempo en segundos

  // Calcula la velocidad de transferencia (ancho de banda)
  const bandwidth = fileSize / transferTime; // En bytes por segundo

  console.log(`Ancho de banda estimado del usuario: ${bandwidth} bytes/segundo`);
});

module.exports = router;
