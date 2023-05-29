const lblOnline = document.querySelector('#lblOffline');
const lblOffline = document.querySelector('#lblOnline');
const txtMensaje = document.querySelector('#txtMensaje');
const btnEnviar = document.querySelector('#btnEnviar');

const socket = io();

socket.on('connect', () => {
  lblOffline.style.display = 'none';
  lblOnline.style.display = '';
});

socket.on('disconnect', () => {
  lblOnline.style.display = 'none';
  lblOffline.style.display = '';
});

socket.on('enviar-mensaje', (payload) => {
  console.log(payload);
});

btnEnviar.addEventListener('click', () => {
  const mensaje = txtMensaje.value;
  const payload = {
    mensaje,
    id: 'DAWD12EFAADW3',
    fecha: new Date().getTime(),
  };
  console.log('payload ->', payload);

  socket.emit('enviar-mensaje', payload);
});
