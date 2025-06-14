import React, { useState } from "react";
import Login from "./Login";
import CategorySelection from "./CategorySelection";
import Game from "./Game";

function App() {
  const [jugador, setJugador] = useState(null);
  const [categoria, setCategoria] = useState(null);

  // Función para cerrar sesión (vuelve a Login)
  const handleLogout = () => {
    setJugador(null);
    setCategoria(null);
  };

  // Regresa a la pantalla de selección de categoría (reinicia el juego)
  const restartGame = () => {
    setCategoria(null);
  };

  return (
    <div>
      {!jugador ? (
        <Login setJugador={setJugador} />
      ) : !categoria ? (
        <CategorySelection setCategoria={setCategoria} onLogout={handleLogout} />
      ) : (
        <Game categoria={categoria} onRestart={restartGame} />
      )}
    </div>
  );
}

export default App;
