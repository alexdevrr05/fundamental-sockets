const lblOnline = document.querySelector('#lblOffline');
const lblOffline = document.querySelector('#lblOnline');
const txtMensaje = document.querySelector('#txtMensaje');
const btnEnviar = document.querySelector('#btnEnviar');

const socket = io();

socket.on('connect', () => {
  console.log('Conectado');

  lblOffline.style.display = 'none';
  lblOnline.style.display = '';
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor');
  lblOnline.style.display = 'none';
  lblOffline.style.display = '';
});

btnEnviar.addEventListener('click', () => {
  const mensaje = txtMensaje.value;
  const payload = {
    mensaje,
    id: 'DAWD12EFAADW3',
    fecha: new Date().getTime(),
  };

  socket.emit('enviar-mensaje', payload);
});
