import { getConnection } from "../config/db.js";
import sql from "mssql";

// ✅ Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Usuarios");
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error.message);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// ✅ Crear un nuevo usuario
export const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const pool = await getConnection();
    await pool
      .request()
      .input("nombre", sql.NVarChar, nombre)
      .input("correo", sql.NVarChar, correo)
      .input("password", sql.NVarChar, password)
      .input("rol", sql.NVarChar, rol || "usuario") // Valor por defecto
      .query(`
        INSERT INTO Usuarios (nombre, correo, password, rol)
        VALUES (@nombre, @correo, @password, @rol)
      `);

    res.status(201).json({ message: "✅ Usuario agregado correctamente" });
  } catch (error) {
    console.error("❌ Error al crear usuario:", error.message);
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

// ✅ Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, password, rol } = req.body;

    if (!id) return res.status(400).json({ message: "ID requerido" });

    const pool = await getConnection();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("nombre", sql.NVarChar, nombre || "")
      .input("correo", sql.NVarChar, correo || "")
      .input("password", sql.NVarChar, password || "")
      .input("rol", sql.NVarChar, rol || "")
      .query(`
        UPDATE Usuarios
        SET nombre=@nombre, correo=@correo, password=@password, rol=@rol
        WHERE id=@id
      `);

    res.json({ message: "✅ Usuario actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error.message);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// ✅ Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "ID requerido" });

    const pool = await getConnection();
    await pool.request().input("id", sql.Int, id).query(`
      DELETE FROM Usuarios WHERE id = @id
    `);

    res.json({ message: "🗑️ Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error.message);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

// ✅ Login de usuario
export const loginUsuario = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: "Faltan correo o contraseña" });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("correo", sql.NVarChar, correo)
      .input("password", sql.NVarChar, password)
      .query("SELECT * FROM Usuarios WHERE correo = @correo AND password = @password");

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const usuario = result.recordset[0];
    res.json({
      message: "✅ Login exitoso",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error.message);
    res.status(500).json({ message: "Error en el servidor durante el login" });
  }
};
