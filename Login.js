import React, { useState } from 'react';
import socket from './sockets';
import './Login.css';

const Login = ({ setJugador }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  // Funciones de ayuda para simular almacenamiento de usuarios en localStorage
  const getRegisteredUsers = () => {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
  };

  const saveRegisteredUsers = (users) => {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      // En modo registro, verificar que las contraseñas coincidan
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }
      // Verificar que el usuario no esté ya registrado
      const users = getRegisteredUsers();
      if (users.find(u => u.username === username)) {
        alert("El usuario ya está registrado, por favor inicia sesión");
        return;
      }
      // Agregar el nuevo usuario
      const newUser = { username, email, password };
      users.push(newUser);
      saveRegisteredUsers(users);
      // Emitir el evento (por este ejemplo lo usamos para notificar al backend)
      socket.emit('registrarJugador', username);
      setJugador(newUser);
    } else {
      // En modo inicio de sesión, verificar que el usuario exista y la contraseña sea correcta
      const users = getRegisteredUsers();
      const existingUser = users.find(u => u.username === username);
      if (!existingUser) {
        alert("El usuario no está registrado, por favor regístrate.");
        return;
      }
      if (existingUser.password !== password) {
        alert("Contraseña incorrecta, intenta de nuevo");
        return;
      }
      socket.emit('registrarJugador', username);
      setJugador(existingUser);
    }
  };

  return (
    <div className="form-container">
      <h2>{isRegistering ? 'Registro' : 'Inicio de Sesión'}</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Nombre de Usuario" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        {isRegistering && (
          <input 
            type="email" 
            placeholder="Correo Electrónico" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        )}
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        {isRegistering && (
          <input 
            type="password" 
            placeholder="Confirmar Contraseña" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        )}
        <button type="submit">
          {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
        </button>
      </form>
      <div style={{ marginTop: '15px' }}>
        <button 
          type="button" 
          onClick={() => setIsRegistering(!isRegistering)}
          style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '14px' }}
        >
          {isRegistering ? 'Ya tengo una cuenta. Inicia Sesión' : '¿No tienes cuenta? Regístrate aquí'}
        </button>
      </div>
    </div>
  );
};

export default Login;
