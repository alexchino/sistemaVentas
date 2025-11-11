import express from "express";
import cors from "cors";
import productoRoutes from "./routes/productoRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import { config } from "./config/config.js";
import { getConnection } from "./config/db.js";
import ventasRoutes from "./routes/ventasRoutes.js";
import clienteRoutes from "./routes/clientesRoutes.js";


const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Verificar conexión a la base de datos
(async () => {
  try {
    const pool = await getConnection();
    console.log("🟢 Conectado correctamente a la base de datos SQL Server");
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error.message);
  }
})();

// ✅ Rutas públicas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/login", usuarioRoutes);

// ✅ Ruta base
app.get("/", (req, res) => {
  res.send("🚀 API del Sistema de Ventas funcionando correctamente");
});

// ✅ Iniciar servidor
app.listen(config.app.port, () => {
  console.log(`✅ Servidor corriendo en puerto ${config.app.port}`);
});
