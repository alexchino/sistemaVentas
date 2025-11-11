import { getConnection, sql } from "../config/db.js";

// 🔹 Obtener todos los clientes
export const obtenerClientes = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Clientes");
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener clientes:", error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

// 🔹 Crear un nuevo cliente
export const crearCliente = async (req, res) => {
  const { Nombre, Apellido, Telefono, Correo } = req.body;

  if (!Nombre || !Apellido) {
    return res
      .status(400)
      .json({ message: "Los campos Nombre y Apellido son obligatorios" });
  }

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("Nombre", sql.NVarChar, Nombre)
      .input("Apellido", sql.NVarChar, Apellido)
      .input("Telefono", sql.NVarChar, Telefono || null)
      .input("Correo", sql.NVarChar, Correo || null)
      .input("FechaRegistro", sql.DateTime, new Date())
      .query(
        "INSERT INTO Clientes (Nombre, Apellido, Telefono, Correo, FechaRegistro) VALUES (@Nombre, @Apellido, @Telefono, @Correo, @FechaRegistro)"
      );

    res.status(201).json({ message: "✅ Cliente creado correctamente" });
  } catch (error) {
    console.error("❌ Error al crear cliente:", error);
    res.status(500).json({ message: "Error al crear cliente" });
  }
};

// 🔹 Actualizar cliente
export const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { Nombre, Apellido, Telefono, Correo } = req.body;

  if (!Nombre || !Apellido) {
    return res
      .status(400)
      .json({ message: "Los campos Nombre y Apellido son obligatorios" });
  }

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("ClienteID", sql.Int, id)
      .input("Nombre", sql.NVarChar, Nombre)
      .input("Apellido", sql.NVarChar, Apellido)
      .input("Telefono", sql.NVarChar, Telefono || null)
      .input("Correo", sql.NVarChar, Correo || null)
      .query(
        "UPDATE Clientes SET Nombre = @Nombre, Apellido = @Apellido, Telefono = @Telefono, Correo = @Correo WHERE ClienteID = @ClienteID"
      );

    res.json({ message: "✅ Cliente actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar cliente" });
  }
};

// 🔹 Eliminar cliente
export const eliminarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("ClienteID", sql.Int, id)
      .query("DELETE FROM Clientes WHERE ClienteID = @ClienteID");

    res.json({ message: "🗑️ Cliente eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar cliente:", error);
    res.status(500).json({ message: "Error al eliminar cliente" });
  }
};
