import React, { useState } from "react";
import "./Login.css";

// Función helper que obtiene los usuarios almacenados y, en caso de estar como array, lo convierte a objeto
const getUsuarios = () => {
  const stored = localStorage.getItem("usuarios");
  let usuarios = {};
  try {
    usuarios = JSON.parse(stored) || {};
  } catch (error) {
    usuarios = {};
  }
  // Si los datos están en formato array (por versiones anteriores), se convierten
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

const Login = ({ setJugador, onSwitchToRegistration }) => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usuario.trim() && password.trim()) {
      const usuarios = getUsuarios();
      if (usuarios[usuario] && usuarios[usuario] === password) {
        setJugador({ usuario, password });
        setError("");
      } else {
        setError("Usuario no registrado o contraseña incorrecta");
      }
    } else {
      setError("Por favor, complete todos los campos");
    }
  };

  return (
    <div className="form-container login-container">
      <h1>Bienvenido</h1>
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
        <button type="submit">Ingresar</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p className="register-text">
        ¿No tienes una cuenta?{" "}
        <button
          type="button"
          className="link-button"
          onClick={onSwitchToRegistration}
        >
          Registrarse
        </button>
      </p>
    </div>
  );
};

export default Login;
