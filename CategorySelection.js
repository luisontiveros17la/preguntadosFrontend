import React from 'react';
import socket from './sockets';
import './CategorySelection.css';

const CategorySelection = ({ setCategoria }) => {
  const seleccionarCategoria = (categoria) => {
    socket.emit('categoriaSeleccionada', categoria);
    setCategoria(categoria);
  };

  return (
    <div className="form-container">
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
    </div>
  );
};

export default CategorySelection;
