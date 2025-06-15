import React, { useState } from "react";
import "./Login.css";

// La misma función helper para garantizar el formato correcto en localStorage
const getUsuarios = () => {
  const stored = localStorage.getItem("usuarios");
  let usuarios = {};
  try {
    usuarios = JSON.parse(stored) || {};
  } catch (error) {
    usuarios = {};
  }
  if (Array.isArray(usuarios)) {
    const usuariosObj = {};
    usuarios.forEach((user) => {
      if (user.usuario && user.password) {
        usuariosObj[user.usuario] = user.password;
      }
    });
    localStorage.setItem("usuarios", JSON.stringify(usuariosObj));
    usuarios = usuariosObj;
  }
  return usuarios;
};

const Registration = ({ setJugador, onSwitchToLogin }) => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usuario.trim() && password.trim()) {
      const usuarios = getUsuarios();
      if (usuarios[usuario]) {
        setError("El usuario ya existe. Por favor, ingresa otro.");
      } else {
        // Agrega el usuario al objeto y lo guarda en localStorage
        usuarios[usuario] = password;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        setJugador({ usuario, password });
        setError("");
      }
    } else {
      setError("Por favor, complete todos los campos");
    }
  };

  return (
    <div className="form-container login-container">
      <h1>Registrarse</h1>
      <h2>Juego Preguntados</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ingrese su usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Registrarse</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p className="register-text">
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
          className="link-button"
          onClick={onSwitchToLogin}
        >
          Iniciar Sesión
        </button>
      </p>
    </div>
  );
};

export default Registration;
