import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Estados del modal
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "",
  });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    setCargando(true);
    try {
      const res = await axios.get("http://localhost:5000/api/usuarios");
      setUsuarios(res.data);
    } catch (error) {
      console.error("❌ Error al obtener usuarios:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleAbrirModal = () => {
    setNuevoUsuario({ nombre: "", correo: "", password: "", rol: "" });
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  const handleGuardarUsuario = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await axios.post("http://localhost:5000/api/usuarios", nuevoUsuario);
      await obtenerUsuarios();
      setMostrarModal(false);
    } catch (error) {
      console.error("❌ Error al guardar usuario:", error);
      alert("Error al guardar el usuario");
    } finally {
      setGuardando(false);
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/usuarios/${id}`);
      await obtenerUsuarios();
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
      alert("Error al eliminar usuario");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Usuarios</h2>
        <button className="btn btn-primary" onClick={handleAbrirModal}>
          ➕ Agregar Usuario
        </button>
      </div>

      {cargando ? (
        <p className="text-center text-muted">Cargando usuarios...</p>
      ) : usuarios.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td>{u.rol}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarUsuario(u.id)}
                    >
                      🗑 Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-muted">No hay usuarios registrados.</p>
      )}

      {/* Modal para agregar usuario */}
      {mostrarModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Agregar nuevo usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCerrarModal}
                ></button>
              </div>
              <form onSubmit={handleGuardarUsuario}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nuevoUsuario.nombre}
                      onChange={(e) =>
                        setNuevoUsuario({
                          ...nuevoUsuario,
                          nombre: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input
                      type="email"
                      className="form-control"
                      value={nuevoUsuario.correo}
                      onChange={(e) =>
                        setNuevoUsuario({
                          ...nuevoUsuario,
                          correo: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      value={nuevoUsuario.password}
                      onChange={(e) =>
                        setNuevoUsuario({
                          ...nuevoUsuario,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select
                      className="form-select"
                      value={nuevoUsuario.rol}
                      onChange={(e) =>
                        setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
                      }
                      required
                    >
                      <option value="">Seleccionar rol...</option>
                      <option value="admin">Administrador</option>
                      <option value="vendedor">Vendedor</option>
                      <option value="cliente">Cliente</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCerrarModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={guardando}
                  >
                    {guardando ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
