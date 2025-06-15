import React, { useState } from 'react';
import socket from './sockets';
import './CategorySelection.css';

const CategorySelection = ({ setCategoria, onLogout }) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const seleccionarCategoria = (categoria) => {
    setSelectedCategory(categoria);
    // Retardo para notar el cambio de fondo
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
      {/* Botón "Cerrar Sesión" sin posición absoluta para que se ajuste al recuadro */}
      <button className="logout-btn" onClick={onLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default CategorySelection;
