// src/App.js
import React, { useState } from "react";
import Login from "./Login";
import Registration from "./Registration";
import ModeSelection from "./ModeSelection";
import CategorySelection from "./CategorySelection";
import Game from "./Game";
import MultiPlayerGame from "./MultiPlayerGame";

function App() {
  const [jugador, setJugador] = useState(null);
  const [mode, setMode] = useState(null); // "single" o "multiplayer"
  const [categoria, setCategoria] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogout = () => {
    setJugador(null);
    setMode(null);
    setCategoria(null);
    setIsRegistering(false);
  };

  const restartGame = () => {
    setCategoria(null);
  };

  const switchToRegistration = () => {
    setIsRegistering(true);
  };

  const switchToLogin = () => {
    setIsRegistering(false);
  };

  // Esta función se llamará desde ModeSelection
  // selectedMode será "single" o "multiplayer"
  // Y en caso de multijugador, podrías recibir información del oponente (opcional)
  const onModeSelected = (selectedMode, opponent) => {
    setMode(selectedMode);
    // Si es necesario, podrías guardar al oponente en otro estado
  };

  if (!jugador) {
    return isRegistering ? (
      <Registration setJugador={setJugador} onSwitchToLogin={switchToLogin} />
    ) : (
      <Login setJugador={setJugador} onSwitchToRegistration={switchToRegistration} />
    );
  } else if (!mode) {
    return <ModeSelection jugador={jugador} onModeSelected={onModeSelected} />;
  } else if (!categoria) {
    return (
      <CategorySelection setCategoria={setCategoria} onLogout={handleLogout} />
    );
  } else {
    return mode === "single" ? (
      <Game categoria={categoria} onRestart={restartGame} />
    ) : (
      <MultiPlayerGame
        categoria={categoria}
        jugador={jugador}
        onRestart={restartGame}
      />
    );
  }
}

export default App;
