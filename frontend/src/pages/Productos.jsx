import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productoActual, setProductoActual] = useState({
    ProductoID: null,
    Nombre: "",
    Descripcion: "",
    Precio: "",
    Stock: "",
    categoria_id: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // 🔹 Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 5;

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, []);

  const obtenerProductos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/productos");
      setProductos(res.data);
    } catch (error) {
      console.error("❌ Error al obtener productos:", error);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categorias");
      setCategorias(res.data);
    } catch (error) {
      console.error("❌ Error al obtener categorías:", error);
    }
  };

  const handleChange = (e) => {
    setProductoActual({ ...productoActual, [e.target.name]: e.target.value });
  };

  const abrirModalAgregar = () => {
    setProductoActual({
      ProductoID: null,
      Nombre: "",
      Descripcion: "",
      Precio: "",
      Stock: "",
      categoria_id: "",
    });
    setModoEdicion(false);
    setShowModal(true);
  };

  const abrirModalEditar = (producto) => {
    setProductoActual(producto);
    setModoEdicion(true);
    setShowModal(true);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await axios.put(
          `http://localhost:5000/api/productos/${productoActual.ProductoID}`,
          productoActual
        );
      } else {
        await axios.post("http://localhost:5000/api/productos", productoActual);
      }
      setShowModal(false);
      obtenerProductos();
    } catch (error) {
      console.error("❌ Error al guardar producto:", error);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        await axios.delete(`http://localhost:5000/api/productos/${id}`);
        obtenerProductos();
      } catch (error) {
        console.error("❌ Error al eliminar producto:", error);
      }
    }
  };

  // 🔍 Filtrado de productos
  const productosFiltrados = productos.filter(
    (p) =>
      p.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.Descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 📄 Paginación
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const indiceFin = indiceInicio + productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indiceInicio, indiceFin);

  const cambiarPagina = (numero) => {
    setPaginaActual(numero);
  };

  return (
    <div className="container mt-5">
      {/* 🔍 Buscador y botón agregar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <input
          type="text"
          placeholder="Buscar producto por nombre o descripción..."
          className="form-control w-50"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
        />
        <button className="btn btn-success btn-lg" onClick={abrirModalAgregar}>
          ➕ Agregar Producto
        </button>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="table-responsive shadow-sm">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosPaginados.map((p) => (
              <tr key={p.ProductoID}>
                <td>{p.ProductoID}</td>
                <td>{p.Nombre}</td>
                <td>{p.Descripcion}</td>
                <td>${p.Precio}</td>
                <td>{p.Stock}</td>
                <td>{p.categoria_id}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => abrirModalEditar(p)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarProducto(p.ProductoID)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {productosPaginados.length === 0 && (
              <tr>
                <td colSpan="7" className="text-muted">
                  No hay productos encontrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINADOR */}
      {totalPaginas > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => cambiarPagina(paginaActual - 1)}
              >
                Anterior
              </button>
            </li>

            {Array.from({ length: totalPaginas }, (_, i) => (
              <li
                key={i}
                className={`page-item ${
                  paginaActual === i + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => cambiarPagina(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                paginaActual === totalPaginas ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => cambiarPagina(paginaActual + 1)}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* MODAL */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content p-4 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {modoEdicion ? "Editar Producto" : "Agregar Nuevo Producto"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={guardarProducto}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        name="Nombre"
                        value={productoActual.Nombre}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Precio</label>
                      <input
                        type="number"
                        step="0.01"
                        name="Precio"
                        value={productoActual.Precio}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Descripción</label>
                      <textarea
                        name="Descripcion"
                        value={productoActual.Descripcion}
                        onChange={handleChange}
                        className="form-control"
                        rows="2"
                      ></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        name="Stock"
                        value={productoActual.Stock}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Categoría</label>
                      <select
                        name="categoria_id"
                        value={productoActual.categoria_id}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        <option value="">Seleccione una categoría</option>
                        {categorias.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {modoEdicion ? "Guardar Cambios" : "Guardar Producto"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
