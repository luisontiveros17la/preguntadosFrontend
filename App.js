import React, { useState } from "react";
import Login from "./Login";
import Registration from "./Registration";
import CategorySelection from "./CategorySelection";
import Game from "./Game";

function App() {
  const [jugador, setJugador] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Función para cerrar sesión (vuelve a Login)
  const handleLogout = () => {
    setJugador(null);
    setCategoria(null);
    setIsRegistering(false);
  };

  // Regresa a la pantalla de selección de categoría (reinicia el juego)
  const restartGame = () => {
    setCategoria(null);
  };

  // Cambia a la vista de registro
  const switchToRegistration = () => {
    setIsRegistering(true);
  };

  // Cambia a la vista de login
  const switchToLogin = () => {
    setIsRegistering(false);
  };

  return (
    <div>
      {!jugador ? (
        isRegistering ? (
          <Registration setJugador={setJugador} onSwitchToLogin={switchToLogin} />
        ) : (
          <Login setJugador={setJugador} onSwitchToRegistration={switchToRegistration} />
        )
      ) : !categoria ? (
        <CategorySelection setCategoria={setCategoria} onLogout={handleLogout} />
      ) : (
        <Game categoria={categoria} onRestart={restartGame} />
      )}
    </div>
  );
}

export default App;
