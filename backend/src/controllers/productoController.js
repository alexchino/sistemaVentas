import { getConnection } from "../config/db.js";
import sql from "mssql";

// ✅ Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT p.*, c.nombre AS CategoriaNombre 
      FROM Productos p 
      LEFT JOIN Categorias c ON p.categoria_id = c.id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// ✅ Crear producto
export const crearProducto = async (req, res) => {
  try {
    const { Nombre, Descripcion, Precio, Stock, categoria_id } = req.body;
    const pool = await getConnection();

    await pool
      .request()
      .input("Nombre", sql.NVarChar, Nombre)
      .input("Descripcion", sql.NVarChar, Descripcion || "")
      .input("Precio", sql.Decimal(10, 2), Precio)
      .input("Stock", sql.Int, Stock)
      .input("categoria_id", sql.Int, categoria_id || null)
      .query(`
        INSERT INTO Productos (Nombre, Descripcion, Precio, Stock, categoria_id)
        VALUES (@Nombre, @Descripcion, @Precio, @Stock, @categoria_id)
      `);

    res.status(201).json({ message: "✅ Producto agregado correctamente" });
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json({ message: "Error al crear producto" });
  }
};

// ✅ Actualizar producto
// ✅ Actualizar producto (corrigido)
export const actualizarProducto = async (req, res) => {
  try {
    const { ProductoID } = req.params;
    const {
      Nombre,
      nombre,
      Descripcion,
      descripcion,
      Precio,
      precio,
      Stock,
      stock,
      categoria_id,
      Categoria_id,
    } = req.body;

    const pool = await getConnection();

    await pool
      .request()
      .input("ProductoID", sql.Int, ProductoID)
      .input("Nombre", sql.NVarChar, Nombre || nombre)
      .input("Descripcion", sql.NVarChar, Descripcion || descripcion || "")
      .input("Precio", sql.Decimal(10, 2), Precio || precio)
      .input("Stock", sql.Int, Stock || stock)
      .input("categoria_id", sql.Int, categoria_id || Categoria_id || null)
      .query(`
        UPDATE Productos 
        SET Nombre=@Nombre, Descripcion=@Descripcion, Precio=@Precio, Stock=@Stock, categoria_id=@categoria_id
        WHERE ProductoID=@ProductoID
      `);

    res.json({ message: "✅ Producto actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};



// ✅ Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    const { ProductoID } = req.params;
    const pool = await getConnection();

    await pool
      .request()
      .input("ProductoID", sql.Int, ProductoID)
      .query("DELETE FROM Productos WHERE ProductoID = @ProductoID");

    res.json({ message: "🗑️ Producto eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};
// ✅ Obtener productos por categoría
export const obtenerProductosPorCategoria = async (req, res) => {
  try {
    const { categoria_id } = req.params;
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("categoria_id", sql.Int, categoria_id)
      .query(`
        SELECT 
          p.ProductoID AS id,
          p.Nombre AS nombre,
          p.Precio AS precio,
          p.Stock AS stock,
          c.nombre AS categoria
        FROM Productos p
        INNER JOIN Categorias c ON p.categoria_id = c.id
        WHERE p.categoria_id = @categoria_id
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener productos por categoría:", error);
    res.status(500).json({ message: "Error al obtener productos por categoría" });
  }
};

