import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Estados del modal
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: "", descripcion: "" });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const obtenerCategorias = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categorias");
      setCategorias(res.data);
    } catch (error) {
      console.error("❌ Error al obtener categorías:", error);
    }
  };

  const mostrarProductosPorCategoria = async (categoria) => {
    setCategoriaSeleccionada(categoria);
    setCargando(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/productos/categoria/${categoria.id}`
      );
      setProductos(res.data);
    } catch (error) {
      console.error("❌ Error al obtener productos:", error);
    } finally {
      setCargando(false);
    }
  };

  const volverACategorias = () => {
    setCategoriaSeleccionada(null);
    setProductos([]);
  };

  const handleAbrirModal = () => {
    setNuevaCategoria({ nombre: "", descripcion: "" });
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  const handleGuardarCategoria = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await axios.post("http://localhost:5000/api/categorias", nuevaCategoria);
      await obtenerCategorias(); // refresca la lista
      setMostrarModal(false);
    } catch (error) {
      console.error("❌ Error al guardar categoría:", error);
      alert("Error al guardar la categoría");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="container mt-5">
      {!categoriaSeleccionada ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Categorías</h2>
            <button className="btn btn-primary" onClick={handleAbrirModal}>
              ➕ Agregar Categoría
            </button>
          </div>

          <div className="row justify-content-center">
            {categorias.length > 0 ? (
              categorias.map((cat) => (
                <div key={cat.id} className="col-10 col-md-4 col-lg-3 mb-4">
                  <div
                    className="card shadow-lg border-0 text-center p-4 bg-light"
                    style={{
                      cursor: "pointer",
                      transition: "0.3s",
                    }}
                    onClick={() => mostrarProductosPorCategoria(cat)}
                  >
                    <h4 className="fw-bold text-primary">{cat.nombre}</h4>
                    <p className="text-muted small mb-0">
                      {cat.descripcion || "Sin descripción"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">No hay categorías registradas.</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">
              Productos en “{categoriaSeleccionada.nombre}”
            </h3>
            <button
              className="btn btn-outline-secondary"
              onClick={volverACategorias}
            >
              ← Volver
            </button>
          </div>

          {cargando ? (
            <p className="text-center text-muted">Cargando productos...</p>
          ) : productos.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered text-center align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.nombre}</td>
                      <td>${p.precio}</td>
                      <td>{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted">
              No hay productos en esta categoría.
            </p>
          )}
        </>
      )}

      {/* Modal para agregar categoría */}
      {mostrarModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Agregar nueva categoría</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCerrarModal}
                ></button>
              </div>
              <form onSubmit={handleGuardarCategoria}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nuevaCategoria.nombre}
                      onChange={(e) =>
                        setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      value={nuevaCategoria.descripcion}
                      onChange={(e) =>
                        setNuevaCategoria({ ...nuevaCategoria, descripcion: e.target.value })
                      }
                      rows="3"
                    ></textarea>
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
