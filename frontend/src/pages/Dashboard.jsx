import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    obtenerCategorias();
    obtenerProductos(); // carga todos al inicio
  }, []);

  const obtenerCategorias = async () => {
    const res = await axios.get("http://localhost:5000/api/categorias");
    setCategorias(res.data);
  };

  const obtenerProductos = async (categoria_id = null) => {
    let url = "http://localhost:5000/api/productos";
    if (categoria_id) url += `/categoria/${categoria_id}`;
    const res = await axios.get(url);
    setProductos(res.data);
  };

  const handleCategoriaClick = (categoria) => {
    setCategoriaSeleccionada(categoria.id);
    obtenerProductos(categoria.id);
  };

  return (
    <div className="dashboard">
      <h2>📦 Categorías</h2>
      <div className="categorias-lista">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoriaClick(cat)}
            className={
              categoriaSeleccionada === cat.id ? "btn-activo" : "btn-normal"
            }
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      <h2>🛒 Productos</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.ProductoID}>
              <td>{p.Nombre}</td>
              <td>{p.Descripcion}</td>
              <td>{p.Precio}</td>
              <td>{p.Stock}</td>
              <td>{p.CategoriaNombre || "Sin categoría"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
