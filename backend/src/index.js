import express from "express";
import cors from "cors";
import productoRoutes from "./routes/productoRoutes.js";
import { config } from "./config/config.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import { verificarToken } from "./middleware/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());


// Rutas públicas

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriaRoutes);

// Middleware de autenticación
app.use(verificarToken);

app.listen(config.app.port, () => {
  console.log(`✅ Servidor corriendo en puerto ${config.app.port}`);
});
