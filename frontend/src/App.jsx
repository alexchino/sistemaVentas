import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Productos from "./pages/Productos";
import Dashboard from "./pages/Dashboard";
import Categorias from "./pages/Categorias";
import Navbar from "./components/navbar";
import Usuarios from "./pages/Usuarios";
import Clientes from "./pages/Clientes.page";
import VentasPage from "./pages/Ventas";

// ✅ Componente que controla si se muestra o no el Navbar
function AppContent() {
  const location = useLocation();
  const ocultarNavbar = location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {!ocultarNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/ventas" element={<VentasPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
