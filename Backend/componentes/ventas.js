/**
 * ventas.js - Rutas API para ventas (MySQL)
 */

const express = require('express');
const router = express.Router();
const { getPool } = require('../Bd/contection');

// GET /api/ventas - Obtener todas las ventas con sus items
router.get('/', async (req, res) => {
  try {
    const db = getPool();
    const [sales] = await db.execute('SELECT * FROM ventas ORDER BY id DESC');

    // Cargar items de cada venta
    for (const sale of sales) {
      const [items] = await db.execute('SELECT * FROM venta_items WHERE ventaId = ?', [sale.id]);
      sale.items = items;
    }

    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ventas', details: err.message });
  }
});

// GET /api/ventas/:id - Obtener una venta por ID
router.get('/:id', async (req, res) => {
  try {
    const db = getPool();
    const [rows] = await db.execute('SELECT * FROM ventas WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    const sale = rows[0];
    const [items] = await db.execute('SELECT * FROM venta_items WHERE ventaId = ?', [sale.id]);
    sale.items = items;

    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener venta', details: err.message });
  }
});

// POST /api/ventas - Registrar nueva venta
router.post('/', async (req, res) => {
  const db = getPool();
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const { clientId, clientName, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      conn.release();
      return res.status(400).json({ error: 'La venta debe incluir al menos un producto (items)' });
    }

    // Validar stock y calcular totales
    let subtotal = 0;
    const itemsData = [];

    for (const item of items) {
      const [prodRows] = await conn.execute('SELECT * FROM productos WHERE id = ?', [item.productId]);
      if (prodRows.length === 0) {
        await conn.rollback();
        conn.release();
        return res.status(400).json({ error: `Producto con ID ${item.productId} no encontrado` });
      }

      const product = prodRows[0];
      if (product.stock < item.qty) {
        await conn.rollback();
        conn.release();
        return res.status(400).json({ error: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}` });
      }

      subtotal += product.price * item.qty;
      itemsData.push({ productId: product.id, name: product.name, qty: item.qty, price: product.price });
    }

    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    // Insertar la venta
    const [saleResult] = await conn.execute(
      'INSERT INTO ventas (date, clientId, clientName, subtotal, tax, total) VALUES (NOW(), ?, ?, ?, ?, ?)',
      [clientId || 0, clientName || 'Cliente general', subtotal, tax, total]
    );
    const ventaId = saleResult.insertId;

    // Insertar items de la venta
    for (const item of itemsData) {
      await conn.execute(
        'INSERT INTO venta_items (ventaId, productId, name, qty, price) VALUES (?, ?, ?, ?, ?)',
        [ventaId, item.productId, item.name, item.qty, item.price]
      );
    }

    // Actualizar stock de productos
    for (const item of itemsData) {
      await conn.execute(
        'UPDATE productos SET stock = GREATEST(0, stock - ?) WHERE id = ?',
        [item.qty, item.productId]
      );
    }

    // Actualizar estadisticas del cliente
    if (clientId) {
      await conn.execute(
        'UPDATE clientes SET purchases = purchases + 1, totalSpent = totalSpent + ? WHERE id = ?',
        [total, clientId]
      );
    }

    await conn.commit();
    conn.release();

    // Devolver la venta creada
    const poolDb = getPool();
    const [newSale] = await poolDb.execute('SELECT * FROM ventas WHERE id = ?', [ventaId]);
    const [newItems] = await poolDb.execute('SELECT * FROM venta_items WHERE ventaId = ?', [ventaId]);
    newSale[0].items = newItems;

    res.status(201).json(newSale[0]);
  } catch (err) {
    await conn.rollback();
    conn.release();
    res.status(500).json({ error: 'Error al registrar venta', details: err.message });
  }
});

module.exports = router;
