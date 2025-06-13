import React, { useState } from "react";
import Login from "./Login";
import CategorySelection from "./CategorySelection";
import Game from "./Game";

function App() {
  const [jugador, setJugador] = useState(null);
  const [categoria, setCategoria] = useState(null);

  // Función para cerrar sesión: se reinicia tanto el jugador como la categoría.
  const handleLogout = () => {
    setJugador(null);
    setCategoria(null);
  };

  // Función para reiniciar el juego (por ejemplo, para volver a seleccionar categoría)
  const restartGame = () => {
    setCategoria(null);
  };

  return (
    <div>
      {/* Si aún no hay usuario, muestra Login */}
      {!jugador ? (
        <Login setJugador={setJugador} />
      ) : 
      /* Si ya está logueado pero no ha seleccionado categoría, muestra la selección */
      !categoria ? (
        <CategorySelection setCategoria={setCategoria} onLogout={handleLogout} />
      ) : (
        /* Si ya se seleccionó categoría, muestra el juego */
        <Game categoria={categoria} onRestart={restartGame} />
      )}
    </div>
  );
}

export default App;
