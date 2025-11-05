import dotenv from "dotenv";
dotenv.config();

export const config = {
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
  app: {
    port: process.env.PORT || 5000,
  },
};
