import React, { useState } from 'react';
import socket from './sockets';

const Login = ({ setJugador }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      // Registro: verificar que las contraseñas coincidan
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }
      // Aquí se podría emitir un evento 'registrarUsuario' al backend
      // Por el momento, usaremos el mismo 'registrarJugador'
      socket.emit('registrarJugador', username);
      setJugador({ username, email });
    } else {
      // Inicio de sesión (para este ejemplo, el backend maneja sólo el nombre)
      socket.emit('registrarJugador', username);
      setJugador({ username, email: null });
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center">{isRegistering ? 'Registro' : 'Inicio de Sesión'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre de Usuario</label>
          <input 
            type="text" 
            className="form-control" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {isRegistering && (
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input 
              type="email" 
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input 
            type="password" 
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {isRegistering && (
          <div className="mb-3">
            <label className="form-label">Confirmar Contraseña</label>
            <input 
              type="password" 
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100">
          {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
        </button>
      </form>
      <div className="text-center mt-3">
        <button 
          className="btn btn-link" 
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Ya tengo una cuenta. Inicia Sesión' : 'No tienes cuenta? Regístrate aquí'}
        </button>
      </div>
    </div>
  );
};

export default Login;
