import React, { useState, useEffect } from 'react';
import socket from './sockets';

const Game = () => {
  const [categoria, setCategoria] = useState(null);
  const [puntuacion, setPuntuacion] = useState(0);

  useEffect(() => {
    // Escuchar el evento para iniciar el juego y establecer la categoría
    socket.on('iniciarJuego', (categoriaSeleccionada) => {
      setCategoria(categoriaSeleccionada);
    });

    // Escuchar el evento para actualizar la puntuación
    socket.on('actualizarPuntuacion', (jugadores) => {
      // Por ejemplo, se usa el primer jugador. Aquí se puede filtrar al jugador actual.
      if (Array.isArray(jugadores) && jugadores.length > 0) {
        setPuntuacion(jugadores[0].puntos);
      }
    });

    return () => {
      socket.off('iniciarJuego');
      socket.off('actualizarPuntuacion');
    };
  }, []);

  return (
    <div className="container mt-5 text-center">
      <h2>Categoría: {categoria || 'Esperando...'}</h2>
      <h3>Puntuación: {puntuacion}</h3>
    </div>
  );
};

export default Game;
