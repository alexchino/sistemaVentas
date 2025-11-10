import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // si usas token
    navigate("/"); // redirige al login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          Sistema de Ventas
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav">
            <Link className="nav-link" to="/productos">
              Productos
            </Link>
            <Link className="nav-link" to="/categorias">
              Categorías
            </Link>
            <Link className="nav-link" to="/clientes">
              Clientes
            </Link>
            <Link className="nav-link" to="/ventas">
              Ventas
            </Link>
              <Link className="nav-link" to="/Usuarios">
              Usuarios
            </Link>
          </div>

          <div className="ms-auto">
            <button onClick={handleLogout} className="btn btn-outline-light">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
