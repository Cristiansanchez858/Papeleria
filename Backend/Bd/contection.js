const mysql = require('mysql2/promise');
const path = require('path');

// Cargar .env
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'coffestore',
};

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...DB_CONFIG,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

async function testConnection() {
  try {
    const db = getPool();
    await db.execute('SELECT 1');
    console.log('Conexion a MySQL exitosa - Base de datos:', DB_CONFIG.database);
  } catch (err) {
    console.error('Error al conectar a MySQL:', err.message);
  }
}

module.exports = {
  getPool,
  testConnection,
};
