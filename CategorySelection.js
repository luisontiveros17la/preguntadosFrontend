import React, { useState } from 'react';
import socket from './sockets';
import './CategorySelection.css';

const CategorySelection = ({ setCategoria, onLogout }) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const seleccionarCategoria = (categoria) => {
    setSelectedCategory(categoria); // Guarda la categoría para aplicar el fondo
    // Retardo para visualizar el cambio de color antes de llamar al juego
    setTimeout(() => {
      socket.emit('categoriaSeleccionada', categoria);
      setCategoria(categoria);
    }, 500);
  };

  return (
    <div className={`form-container ${selectedCategory}`}>
      <h2>Selecciona una Categoría</h2>
      <div className="button-group">
        <button onClick={() => seleccionarCategoria('culturaGeneral')}>
          Cultura General
        </button>
        <button onClick={() => seleccionarCategoria('videojuegos')}>
          Videojuegos
        </button>
        <button onClick={() => seleccionarCategoria('deportes')}>
          Deportes
        </button>
      </div>
      <button className="logout-btn" onClick={onLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default CategorySelection;
