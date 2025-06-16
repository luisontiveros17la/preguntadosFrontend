import React, { useState, useEffect, useCallback } from "react";
import socket from "./sockets";
import "./ModeSelection.css";

const ModeSelection = ({ jugador, onModeSelected }) => {
  const [onlinePlayers, setOnlinePlayers] = useState([]);

  // Función que devuelve una categoría aleatoria para multijugador
  const getRandomCategory = () => {
    const categories = ["Historia", "Ciencia", "Deportes", "Arte"];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  // Solicita la lista de jugadores
  const refreshPlayers = useCallback(() => {
    socket.emit("getOnlinePlayers");
  }, []);

  useEffect(() => {
    // Registro automático del jugador
    if (jugador && jugador.usuario) {
      socket.emit("joinGame", { jugador });
    } else {
      console.log("🚨 Datos de jugador no válidos para joinGame");
    }

    refreshPlayers();

    const handlePlayersOnline = (data) => {
      setOnlinePlayers(Array.isArray(data) ? data : []);
    };

    // Listener para la lista de jugadores
    socket.on("playersOnline", handlePlayersOnline);

    // Listener para iniciar el juego automáticamente
    socket.on("startGame", (data) => {
      const randomCategory = getRandomCategory();
      console.log("⭐ Evento startGame recibido:", data, "Categoría:", randomCategory);
      onModeSelected("multiplayer", { opponent: data.opponent, category: randomCategory });
    });

    return () => {
      socket.off("playersOnline", handlePlayersOnline);
      socket.off("startGame");
    };
  }, [jugador, refreshPlayers, onModeSelected]);

  const sendChallenge = (player) => {
    // Envía el desafío: tanto retador como retado deberán recibir "startGame"
    socket.emit("challenge", { from: jugador, to: player });
  };

  return (
    <div className="form-container mode-selection-container">
      <h2>Selecciona modo de juego</h2>
      <div className="mode-buttons">
        <button className="blue-btn" onClick={() => onModeSelected("single")}>
          Un jugador
        </button>
        <button className="blue-btn" onClick={refreshPlayers}>
          Actualizar Jugadores
        </button>
      </div>
      <h3>Jugadores en línea</h3>
      {onlinePlayers.length === 0 ? (
        <p>No hay jugadores disponibles.</p>
      ) : (
        <ul>
          {onlinePlayers.map((player) => (
            <li key={player.socketId}>
              {player.usuario}{" "}
              <button className="blue-btn small-btn" onClick={() => sendChallenge(player)}>
                Desafiar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ModeSelection;
