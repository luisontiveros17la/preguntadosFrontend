import React, { useState } from "react";
import "./Login.css";

const Login = ({ setJugador }) => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías agregar lógica de autenticación real.
    if (usuario.trim() && password.trim()) {
      setJugador({ usuario, password });
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
      <p className="register-text">
        ¿No tienes una cuenta? <a href="/register">Registrarse</a>
      </p>
    </div>
  );
};

export default Login;
