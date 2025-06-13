import React, { useState } from 'react';
import socket from './sockets';

const CategorySelection = ({ setCategoria }) => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  const seleccionarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    socket.emit('categoriaSeleccionada', categoria);
    setCategoria(categoria);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Selecciona una categoría:</h2>
      <div className="d-grid gap-2">
        <button 
          className="btn btn-outline-primary" 
          onClick={() => seleccionarCategoria('culturaGeneral')}
        >
          Cultura General
        </button>
        <button 
          className="btn btn-outline-primary" 
          onClick={() => seleccionarCategoria('videojuegos')}
        >
          Videojuegos
        </button>
        <button 
          className="btn btn-outline-primary" 
          onClick={() => seleccionarCategoria('deportes')}
        >
          Deportes
        </button>
      </div>
    </div>
  );
};

export default CategorySelection;
