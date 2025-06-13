import React, { useState } from 'react';
import Login from './Login';
import CategorySelection from './CategorySelection';
import Game from './Game';

function App() {
  const [jugador, setJugador] = useState(null);
  const [categoria, setCategoria] = useState(null);

  return (
    <div>
      {!jugador ? (
        <Login setJugador={setJugador} />
      ) : !categoria ? (
        <CategorySelection setCategoria={setCategoria} />
      ) : (
        <Game categoria={categoria} />
      )}
    </div>
  );
}

export default App;
