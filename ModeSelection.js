// src/ModeSelection.js (Frontend)
import React, { useState, useEffect, useCallback } from "react";
import socket from "./sockets";
import "./ModeSelection.css";

const ModeSelection = ({ jugador, onModeSelected }) => {
  const [mode, setMode] = useState(null);
  const [onlinePlayers, setOnlinePlayers] = useState([]);
  const [challengeReceived, setChallengeReceived] = useState(null);

  const refreshPlayers = useCallback(() => {
    console.log("🔄 Botón Refrescar presionado, solicitando jugadores...");
    socket.emit("getOnlinePlayers");
  }, []);

  useEffect(() => {
    // Registra el jugador para que el backend lo incluya en la lista.
    if (jugador && jugador.usuario) {
      socket.emit("joinGame", { jugador });
    } else {
      console.log("🚨 No se recibió información válida del jugador para el joinGame");
    }

    refreshPlayers();

    const handlePlayersOnline = (data) => {
      console.log("⚡ Lista de jugadores recibida:", data);
      setOnlinePlayers(Array.isArray(data) ? data : []);
    };

    socket.on("playersOnline", handlePlayersOnline);
    socket.on("challengeRequest", (data) => {
      setChallengeReceived(data.from);
    });
    socket.on("challengeResponse", (data) => {
      if (data.accepted) {
        // El jugador que envió el reto recibe la respuesta de aceptación
        onModeSelected("multiplayer", data.from);
      } else {
        alert(`El jugador ${data.from.usuario} rechazó tu reto.`);
      }
    });

    return () => {
      socket.off("playersOnline", handlePlayersOnline);
      socket.off("challengeRequest");
      socket.off("challengeResponse");
    };
  }, [jugador, refreshPlayers, onModeSelected]);

  const handleSinglePlayer = () => {
    setMode("single");
    onModeSelected("single");
  };

  const handleMultiplayer = () => {
    setMode("multiplayer");
    refreshPlayers();
  };

  const handleGoBack = () => {
    setMode(null);
  };

  const sendChallenge = (player) => {
    socket.emit("challenge", { from: jugador, to: player });
    alert(`Reto enviado a ${player.usuario}. Esperando respuesta...`);
  };

  const acceptChallenge = () => {
    // El jugador desafiado acepta el reto y se inicia el juego automáticamente.
    socket.emit("challengeResponse", {
      from: jugador,
      accepted: true,
      challenger: challengeReceived,
    });
    onModeSelected("multiplayer", challengeReceived);
    setChallengeReceived(null);
  };

  const declineChallenge = () => {
    socket.emit("challengeResponse", {
      from: jugador,
      accepted: false,
      challenger: challengeReceived,
    });
    setChallengeReceived(null);
  };

  return (
    <div className="form-container mode-selection-container">
      <h2>Selecciona modo de juego</h2>
      {mode === null && (
        <div className="mode-buttons">
          <button className="blue-btn" onClick={handleSinglePlayer}>
            Un jugador
          </button>
          <button className="blue-btn" onClick={handleMultiplayer}>
            Multijugador
          </button>
        </div>
      )}

      {mode === "multiplayer" && (
        <div className="multiplayer-lobby">
          <h3>Jugadores en línea</h3>
          {onlinePlayers.length === 0 ? (
            <p>No hay jugadores disponibles.</p>
          ) : (
            <ul>
              {onlinePlayers.map((player) => (
                <li key={player.socketId}>
                  {player.usuario}{" "}
                  <button className="blue-btn small-btn" onClick={() => sendChallenge(player)}>
                    Reto
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button className="blue-btn refresh-btn" onClick={refreshPlayers}>
            <i className="bi bi-arrow-clockwise"></i> Refrescar
          </button>
          <button className="blue-btn back-btn" onClick={handleGoBack}>
            <i className="bi bi-arrow-left"></i> Regresar
          </button>

          {challengeReceived && (
            <div className="challenge-request">
              <p>
                El jugador {challengeReceived.usuario} te retó, ¿aceptas el reto?
              </p>
              <div className="challenge-buttons">
                <button className="blue-btn" onClick={acceptChallenge}>
                  Aceptar
                </button>
                <button className="blue-btn" onClick={declineChallenge}>
                  Rechazar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModeSelection;
