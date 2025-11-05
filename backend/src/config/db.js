import sql from "mssql";
import { config } from "../config/config.js";

export const getConnection = async () => {
  try {
    const pool = await sql.connect(config.db);
    return pool;
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  }
};

export { sql };
