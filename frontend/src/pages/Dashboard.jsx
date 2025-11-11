import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  const nombreUsuario = localStorage.getItem("nombre") || "Usuario";

  const handleCerrarSesion = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div className="card shadow-lg p-5 text-center" style={{ maxWidth: "600px", width: "100%" }}>
        <h1 className="mb-3 text-primary">¡Bienvenido al Sistema!</h1>
        <h3 className="mb-4">👋 Hola, {nombreUsuario}</h3>
        <p className="lead text-muted mb-4">
          Has iniciado sesión correctamente. Usa el menú de navegación para administrar tu sistema.
        </p>
        
      </div>
    </div>
  );
}
