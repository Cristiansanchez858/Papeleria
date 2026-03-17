/**
 * productos.js - Rutas API para productos (MySQL)
 */

const express = require('express');
const router = express.Router();
const { getPool } = require('../Bd/contection');

// GET /api/productos - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const db = getPool();
    const [rows] = await db.execute('SELECT * FROM productos ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos', details: err.message });
  }
});

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const db = getPool();
    const [rows] = await db.execute('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener producto', details: err.message });
  }
});

// POST /api/productos - Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { name, category, price, stock, minStock, description } = req.body;

    if (!name || !category || price == null || stock == null || minStock == null) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: name, category, price, stock, minStock' });
    }

    const db = getPool();
    const [result] = await db.execute(
      'INSERT INTO productos (name, category, price, stock, minStock, description) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category, parseFloat(price), parseInt(stock, 10), parseInt(minStock, 10), description || '']
    );

    const [rows] = await db.execute('SELECT * FROM productos WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear producto', details: err.message });
  }
});

// PUT /api/productos/:id - Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const db = getPool();
    const [existing] = await db.execute('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const current = existing[0];
    const { name, category, price, stock, minStock, description } = req.body;

    await db.execute(
      'UPDATE productos SET name = ?, category = ?, price = ?, stock = ?, minStock = ?, description = ? WHERE id = ?',
      [
        name !== undefined ? name : current.name,
        category !== undefined ? category : current.category,
        price !== undefined ? parseFloat(price) : current.price,
        stock !== undefined ? parseInt(stock, 10) : current.stock,
        minStock !== undefined ? parseInt(minStock, 10) : current.minStock,
        description !== undefined ? description : current.description,
        req.params.id,
      ]
    );

    const [rows] = await db.execute('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar producto', details: err.message });
  }
});

// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const db = getPool();
    const [existing] = await db.execute('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await db.execute('DELETE FROM productos WHERE id = ?', [req.params.id]);
    res.json({ message: 'Producto eliminado', product: existing[0] });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto', details: err.message });
  }
});

module.exports = router;
