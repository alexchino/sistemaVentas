import { Router } from "express";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosPorCategoria
} from "../controllers/productoController.js";

const router = Router();

router.get("/", obtenerProductos);
router.post("/", crearProducto);
router.put("/:ProductoID", actualizarProducto);
router.delete("/:ProductoID", eliminarProducto);
router.get("/categoria/:categoria_id", obtenerProductosPorCategoria);

export default router;
