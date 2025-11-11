import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nuevoCliente, setNuevoCliente] = useState({
    Nombre: "",
    Apellido: "",
    Telefono: "",
    Correo: "",
  });

  // 🔹 Cargar lista de clientes al iniciar
  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clientes");
      setClientes(res.data);
    } catch (err) {
      console.error("Error al obtener clientes:", err);
    }
  };

  const manejarCambio = (e) => {
    setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value });
  };

  const abrirModal = (cliente = null) => {
    if (cliente) {
      setEditando(cliente.ClienteID);
      setNuevoCliente({
        Nombre: cliente.Nombre,
        Apellido: cliente.Apellido,
        Telefono: cliente.Telefono,
        Correo: cliente.Correo,
      });
    } else {
      setEditando(null);
      setNuevoCliente({
        Nombre: "",
        Apellido: "",
        Telefono: "",
        Correo: "",
      });
    }
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const guardarCliente = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(
          `http://localhost:5000/api/clientes/${editando}`,
          nuevoCliente
        );
      } else {
        await axios.post("http://localhost:5000/api/clientes", nuevoCliente);
      }
      setMostrarModal(false);
      setEditando(null);
      obtenerClientes();
    } catch (err) {
      console.error("Error al guardar cliente:", err);
    }
  };

  const eliminarCliente = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/clientes/${id}`);
      obtenerClientes();
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
    }
  };

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.Apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.Correo && c.Correo.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="container mt-4">
      {/* 🔍 Buscador y botón */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Buscar por nombre o correo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button className="btn btn-success" onClick={() => abrirModal()}>
          ➕ Nuevo Cliente
        </button>
      </div>

      {/* 📋 Tabla de clientes */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark text-center">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Fecha Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {clientesFiltrados.length > 0 ? (
            clientesFiltrados.map((cliente) => (
              <tr key={cliente.ClienteID}>
                <td>{cliente.ClienteID}</td>
                <td>{cliente.Nombre}</td>
                <td>{cliente.Apellido}</td>
                <td>{cliente.Telefono || "—"}</td>
                <td>{cliente.Correo || "—"}</td>
                <td>
                  {cliente.FechaRegistro
                    ? new Date(cliente.FechaRegistro).toLocaleDateString()
                    : "—"}
                </td>
                <td>
                  <button
                    onClick={() => abrirModal(cliente)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => eliminarCliente(cliente.ClienteID)}
                    className="btn btn-danger btn-sm"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No hay clientes registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🧾 Modal para agregar/editar */}
      <Modal show={mostrarModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editando ? "✏️ Editar Cliente" : "➕ Nuevo Cliente"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={guardarCliente}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="Nombre"
                value={nuevoCliente.Nombre}
                onChange={manejarCambio}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="Apellido"
                value={nuevoCliente.Apellido}
                onChange={manejarCambio}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="Telefono"
                value={nuevoCliente.Telefono}
                onChange={manejarCambio}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                name="Correo"
                value={nuevoCliente.Correo}
                onChange={manejarCambio}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={cerrarModal}>
              ❌ Cancelar
            </Button>
            <Button type="submit" variant="success">
              {editando ? "💾 Guardar cambios" : "➕ Agregar"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
