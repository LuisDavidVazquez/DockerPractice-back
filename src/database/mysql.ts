import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { Signale } from "signale";

dotenv.config();
const signale = new Signale();

signale.info("Connecting to DB with the following credentials:");
signale.info(`Host: ${process.env.DB_HOST}`);
signale.info(`User: ${process.env.DB_USER}`);
signale.info(`Database: ${process.env.DB_DATABASE}`);

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
};

const pool = mysql.createPool(config);

export async function initializePaymentTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS payment (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      concept VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    const conn = await pool.getConnection();
    await conn.execute(sql);
    conn.release();
    signale.success("Tabla 'payment' inicializada correctamente");
  } catch (error) {
    signale.error("Error al inicializar la tabla 'payment':", error);
  }
}

export async function query(sql: string, params: any[]) {
  try {
    const conn = await pool.getConnection();
    signale.success("Conexión exitosa a la base de datos");

    // Puedes añadir esta línea para verificar la conexión
    signale.info("Conexión establecida correctamente a la base de datos.");

    const result = await conn.execute(sql, params);
    conn.release();
    return result;
  } catch (error) {
    signale.error("Error en la conexión a la base de datos:", error);
    return null;
  }
}