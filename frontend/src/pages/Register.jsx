import React, { useState } from "react";
import api from "../api/api";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("usuario");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/usuarios", {
        nombre,
        correo,
        password,
        rol,
      });
      alert(res.data.message);
    } catch (error) {
      alert("Error al registrar usuario");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Registrar usuario</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <br />
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Rol"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        />
        <br />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}
