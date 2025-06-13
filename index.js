import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Si no has incluido Bootstrap en index.html, puedes importarlo aquí
// import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
