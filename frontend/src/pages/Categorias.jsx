import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(false);

  // --- Buscador ---
  const [busqueda, setBusqueda] = useState("");

  // --- Modal Agregar Categoría ---
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: "", descripcion: "" });
  const [guardando, setGuardando] = useState(false);

  // --- Modal Editar Categoría ---
  const [categoriaEditando, setCategoriaEditando] = useState({ id: "", nombre: "", descripcion: "" });
  const [mostrarModalEditarCategoria, setMostrarModalEditarCategoria] = useState(false);

  // --- Modal Editar Producto ---
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [productoEditando, setProductoEditando] = useState({ id: "", nombre: "", precio: "", stock: "" });
  const [guardandoProducto, setGuardandoProducto] = useState(false);

  // --- Paginación ---
  const [paginaActual, setPaginaActual] = useState(1);
  const categoriasPorPagina = 6;

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
      const res = await axios.get(`http://localhost:5000/api/productos/categoria/${categoria.id}`);
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

  // --- Agregar Categoría ---
  const handleAbrirModal = () => {
    setNuevaCategoria({ nombre: "", descripcion: "" });
    setMostrarModal(true);
  };

  const handleCerrarModal = () => setMostrarModal(false);

  const handleGuardarCategoria = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await axios.post("http://localhost:5000/api/categorias", nuevaCategoria);
      await obtenerCategorias();
      setMostrarModal(false);
    } catch (error) {
      console.error("❌ Error al guardar categoría:", error);
      alert("Error al guardar la categoría");
    } finally {
      setGuardando(false);
    }
  };

  // --- Editar Categoría ---
  const abrirModalEditarCategoria = (cat) => {
    setCategoriaEditando(cat);
    setMostrarModalEditarCategoria(true);
  };

  const handleGuardarCategoriaEditada = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/categorias/${categoriaEditando.id}`, categoriaEditando);
      await obtenerCategorias();
      setMostrarModalEditarCategoria(false);
    } catch (error) {
      console.error("❌ Error al actualizar categoría:", error);
      alert("Error al actualizar categoría");
    }
  };

  // --- Eliminar Categoría ---
  const eliminarCategoria = async (id) => {
    const categoria = categorias.find((c) => c.id === id);
    if (!categoria) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/productos/categoria/${id}`);
      if (res.data.length > 0) {
        alert("❌ No puedes eliminar la categoría porque tiene productos asociados");
        return;
      }

      if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;

      await axios.delete(`http://localhost:5000/api/categorias/${id}`);
      if (categoriaSeleccionada?.id === id) volverACategorias();
      await obtenerCategorias();
    } catch (error) {
      console.error("❌ Error al eliminar categoría:", error);
      alert("Error al eliminar categoría");
    }
  };

  // --- Editar Producto ---
  const abrirModalEditarProducto = (producto) => {
    setProductoEditando(producto);
    setMostrarModalProducto(true);
  };

  const cerrarModalProducto = () => setMostrarModalProducto(false);

  const handleGuardarProducto = async (e) => {
    e.preventDefault();
    setGuardandoProducto(true);
    try {
      await axios.put(`http://localhost:5000/api/productos/${productoEditando.id}`, productoEditando);
      setProductos((prev) => prev.map((p) => (p.id === productoEditando.id ? productoEditando : p)));
      setMostrarModalProducto(false);
    } catch (error) {
      console.error("❌ Error al actualizar producto:", error);
      alert("Error al actualizar el producto");
    } finally {
      setGuardandoProducto(false);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/productos/${id}`);
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("❌ Error al eliminar producto:", error);
    }
  };

  // --- Filtrado ---
  const categoriasFiltradas = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // --- Paginación ---
  const totalPaginas = Math.ceil(categoriasFiltradas.length / categoriasPorPagina);
  const indiceInicial = (paginaActual - 1) * categoriasPorPagina;
  const categoriasMostradas = categoriasFiltradas.slice(
    indiceInicial,
    indiceInicial + categoriasPorPagina
  );

  const cambiarPagina = (num) => setPaginaActual(num);

  return (
    <div className="container mt-5">
      {!categoriaSeleccionada ? (
        <>
          {/* Buscador + botón agregar */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <input
              type="text"
              className="form-control w-50"
              placeholder="🔍 Buscar categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleAbrirModal}>
              ➕ Nueva Categoria
            </button>
          </div>

          {/* Lista de categorías */}
          <div className="row">
            {categoriasMostradas.length > 0 ? (
              categoriasMostradas.map((cat) => (
                <div key={cat.id} className="col-12 col-md-4 mb-4">
                  <div className="card shadow-sm border-0 p-3">
                    <h5
                      className="fw-bold text-primary mb-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => mostrarProductosPorCategoria(cat)}
                    >
                      {cat.nombre}
                    </h5>
                    <p className="text-muted small mb-3">{cat.descripcion || "Sin descripción"}</p>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => abrirModalEditarCategoria(cat)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarCategoria(cat.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted mt-4">No hay categorías registradas.</p>
            )}
          </div>

          {/* --- Paginador --- */}
          {totalPaginas > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                {Array.from({ length: totalPaginas }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}
                  >
                    <button className="page-link" onClick={() => cambiarPagina(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      ) : (
        <>
          {/* Vista de productos por categoría */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold">Productos en “{categoriaSeleccionada.nombre}”</h4>
            <button className="btn btn-outline-secondary" onClick={volverACategorias}>
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
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.nombre}</td>
                      <td>${p.precio}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => abrirModalEditarProducto(p)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminarProducto(p.id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted">No hay productos en esta categoría.</p>
          )}
        </>
      )}

      {/* Modales (agregar, editar, producto) se mantienen igual */}
      {mostrarModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar nueva categoría</h5>
                <button type="button" className="btn-close" onClick={handleCerrarModal}></button>
              </div>
              <form onSubmit={handleGuardarCategoria}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nuevaCategoria.nombre}
                      onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      value={nuevaCategoria.descripcion}
                      onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, descripcion: e.target.value })}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCerrarModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={guardando}>
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
