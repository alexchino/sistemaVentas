import { getConnection } from "../config/db.js";
import sql from "mssql";

// ✅ Obtener todas las categorías
export const obtenerCategorias = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Categorias");
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error.message);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
};

// ✅ Crear una nueva categoría
export const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const pool = await getConnection();
    await pool
      .request()
      .input("nombre", sql.NVarChar, nombre)
      .input("descripcion", sql.NVarChar, descripcion || "")
      .query(`
        INSERT INTO Categorias (nombre, descripcion)
        VALUES (@nombre, @descripcion)
      `);

    res.status(201).json({ message: "✅ Categoría creada correctamente" });
  } catch (error) {
    console.error("❌ Error al crear categoría:", error.message);
    res.status(500).json({ message: "Error al crear categoría" });
  }
};

// ✅ Actualizar categoría
export const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    if (!id) return res.status(400).json({ message: "ID de categoría requerido" });

    const pool = await getConnection();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("nombre", sql.NVarChar, nombre || "")
      .input("descripcion", sql.NVarChar, descripcion || "")
      .query(`
        UPDATE Categorias
        SET nombre = @nombre, descripcion = @descripcion
        WHERE id = @id
      `);

    res.json({ message: "✅ Categoría actualizada correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar categoría:", error.message);
    res.status(500).json({ message: "Error al actualizar categoría" });
  }
};

// ✅ Eliminar categoría
export const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "ID de categoría requerido" });

    const pool = await getConnection();
    await pool.request().input("id", sql.Int, id).query(`
      DELETE FROM Categorias WHERE id = @id
    `);

    res.json({ message: "🗑️ Categoría eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar categoría:", error.message);
    res.status(500).json({ message: "Error al eliminar categoría" });
  }
};
