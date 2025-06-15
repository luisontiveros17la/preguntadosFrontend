// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Asegúrate de importar el fondo global
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
