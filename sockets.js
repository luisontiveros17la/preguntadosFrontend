import { io } from 'socket.io-client';

// Conecta al backend (asegúrate de que el servidor esté activo en http://localhost:3000)
const socket = io("http://192.168.0.101:3001/", {
  transports: ['websocket']
});

export default socket;
