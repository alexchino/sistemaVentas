import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function VentasPage() {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [clienteNombre, setClienteNombre] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    obtenerProductos();
    obtenerClientes();
  }, []);

  const obtenerProductos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/productos");
      setProductos(res.data);
    } catch (err) {
      console.error("❌ Error al obtener productos:", err);
    }
  };

  const obtenerClientes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clientes");
      setClientes(res.data);
    } catch (err) {
      console.error("❌ Error al obtener clientes:", err);
    }
  };

  const buscarProducto = (nombre) => {
    setBusquedaProducto(nombre);
    const producto = productos.find(
      (p) =>
        (p.nombre || "").toLowerCase() === nombre.toLowerCase() ||
        (p.Nombre || "").toLowerCase() === nombre.toLowerCase()
    );
    setProductoSeleccionado(producto || null);
    setMensaje("");
  };

  const realizarVenta = async () => {
    if (!productoSeleccionado) {
      setMensaje("⚠️ Debes seleccionar un producto válido.");
      return;
    }

    if (productoSeleccionado.stock < cantidad) {
      setMensaje("❌ Stock insuficiente para realizar la venta.");
      return;
    }

    if (!clienteNombre.trim()) {
      setMensaje("⚠️ Ingresa el nombre del cliente.");
      return;
    }

    try {
      // Buscar cliente existente o crear nuevo
      let cliente = clientes.find(
        (c) =>
          (c.Nombre || c.nombre || "").toLowerCase() ===
          clienteNombre.toLowerCase()
      );

      if (!cliente) {
        const nuevoCliente = await axios.post(
          "http://localhost:5000/api/clientes",
          { Nombre: clienteNombre }
        );
        cliente = nuevoCliente.data;
      }

      // Registrar venta
      await axios.post("http://localhost:5000/api/ventas", {
        ClienteID: cliente.ClienteID || cliente.id,
        ProductoID: productoSeleccionado.ProductoID || productoSeleccionado.id,
        Cantidad: cantidad,
      });

      setMensaje("✅ Venta realizada correctamente.");
      setBusquedaProducto("");
      setProductoSeleccionado(null);
      setClienteNombre("");
      setCantidad(1);
      obtenerProductos(); // actualizar stock
    } catch (err) {
      console.error("❌ Error al realizar la venta:", err);
      setMensaje("❌ Error al procesar la venta.");
    }
  };

  return (
    <div className="container mt-5">

      <div className="card shadow p-4">
        <div className="row g-3">
          {/* Buscar producto */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Producto</label>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar producto..."
              value={busquedaProducto}
              onChange={(e) => buscarProducto(e.target.value)}
              list="listaProductos"
            />
            <datalist id="listaProductos">
              {productos.map((p) => (
                <option key={p.ProductoID || p.id} value={p.Nombre || p.nombre}>
                  {p.Nombre || p.nombre}
                </option>
              ))}
            </datalist>

            {productoSeleccionado ? (
              productoSeleccionado.stock > 0 ? (
                <div className="mt-2 text-success">
                  ✅ En stock: {productoSeleccionado.stock} unidades
                </div>
              ) : (
                <div className="mt-2 text-danger">❌ Producto agotado</div>
              )
            ) : (
              <div className="mt-2 text-muted">🔍 Escribe para buscar</div>
            )}
          </div>

          {/* Cliente */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Cliente</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nombre del cliente..."
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              list="listaClientes"
            />
            <datalist id="listaClientes">
              {clientes.map((c) => (
                <option key={c.ClienteID || c.id} value={c.Nombre || c.nombre}>
                  {c.Nombre || c.nombre}
                </option>
              ))}
            </datalist>
          </div>

          {/* Cantidad */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">Cantidad</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </div>

          {/* Botón vender */}
          <div className="col-md-8 d-flex align-items-end">
            <button
              className="btn btn-success w-100"
              onClick={realizarVenta}
              disabled={!productoSeleccionado}
            >
              💰 Realizar Venta
            </button>
          </div>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div className="alert alert-info text-center mt-4">{mensaje}</div>
        )}
      </div>
    </div>
  );
}
