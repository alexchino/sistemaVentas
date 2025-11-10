import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Productos from "./pages/Productos";
import Dashboard from "./pages/Dashboard";
import Categorias from "./pages/Categorias"; 
import Navbar from "./components/navbar";
import Usuarios from "./pages/Usuarios";
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Routes>
    </Router>
  );
}
