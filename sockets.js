import { io } from 'socket.io-client';

// Conecta al backend (asegúrate de que el servidor esté activo en http://localhost:3000)
const socket = io("http://localhost:3000", {
  transports: ['websocket']
});

export default socket;
