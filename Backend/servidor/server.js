/**
 * server.js - Servidor Express para el Sistema de Gestion de Papeleria
 * Base de datos: MySQL (coffestore)
 *
 * Ejecutar:
 *   cd Backend
 *   npm install
 *   npm start
 *
 * El servidor corre en http://localhost:3000
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { getPool, testConnection } = require('../Bd/contection');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// Servir archivos estaticos del Frontend
app.use(express.static(path.join(__dirname, '..', '..', 'Frontend')));

// ==================== RUTAS API ====================

// Productos
const productosRouter = require('../componentes/productos');
app.use('/api/productos', productosRouter);

// Ventas
const ventasRouter = require('../componentes/ventas');
app.use('/api/ventas', ventasRouter);

// Clientes
const clientesRouter = require('../componentes/clientes');
app.use('/api/clientes', clientesRouter);

// ==================== AUTH ====================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contrasena son obligatorios' });
    }

    const db = getPool();
    const [rows] = await db.execute(
      'SELECT * FROM usuarios WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario o contrasena incorrectos' });
    }

    const user = rows[0];
    res.json({
      message: 'Login exitoso',
      user: { id: user.id, username: user.username, name: user.name, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error en login', details: err.message });
  }
});

// ==================== REPORTES ====================
app.get('/api/reportes/resumen', async (req, res) => {
  try {
    const db = getPool();

    const [salesStats] = await db.execute(
      'SELECT COUNT(*) AS totalSales, IFNULL(SUM(total), 0) AS totalRevenue FROM ventas'
    );
    const totalRevenue = parseFloat(salesStats[0].totalRevenue);
    const totalSales = salesStats[0].totalSales;

    const [itemsStats] = await db.execute(
      'SELECT IFNULL(SUM(qty), 0) AS totalProductsSold FROM venta_items'
    );
    const totalProductsSold = itemsStats[0].totalProductsSold;

    const avgSale = totalSales > 0 ? totalRevenue / totalSales : 0;

    const [topProducts] = await db.execute(`
      SELECT name, SUM(qty) AS qty, SUM(qty * price) AS revenue
      FROM venta_items
      GROUP BY name
      ORDER BY qty DESC
      LIMIT 5
    `);

    const [topClients] = await db.execute(
      'SELECT * FROM clientes ORDER BY totalSpent DESC LIMIT 5'
    );

    const [lowStock] = await db.execute(
      'SELECT * FROM productos WHERE stock <= minStock ORDER BY stock ASC'
    );

    res.json({
      totalRevenue,
      totalSales,
      totalProductsSold,
      avgSale,
      topProducts,
      topClients,
      lowStock,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al generar reporte', details: err.message });
  }
});

// ==================== RUTA PRINCIPAL ====================
app.get('/', (req, res) => {
  res.redirect('/pages/Login.html');
});

// ==================== INICIAR SERVIDOR ====================
async function startServer() {
  try {
    // Verificar conexion a MySQL
    await testConnection();

    app.listen(PORT, () => {
      console.log('===========================================');
      console.log('  Papeleria - Sistema de Gestion');
      console.log('  Base de datos: MySQL (' + (process.env.DB_NAME || 'coffestore') + ')');
      console.log('  Servidor: http://localhost:' + PORT);
      console.log('  Frontend: http://localhost:' + PORT + '/pages/Login.html');
      console.log('===========================================');
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err.message);
    process.exit(1);
  }
}

startServer();
