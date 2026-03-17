/**
 * clientes.js - Rutas API para clientes (MySQL)
 */

const express = require('express');
const router = express.Router();
const { getPool } = require('../Bd/contection');

// GET /api/clientes - Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const db = getPool();
    const [rows] = await db.execute('SELECT * FROM clientes ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener clientes', details: err.message });
  }
});

// GET /api/clientes/:id - Obtener un cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const db = getPool();
    const [rows] = await db.execute('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener cliente', details: err.message });
  }
});

// POST /api/clientes - Crear nuevo cliente
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, notes } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El campo "name" es obligatorio' });
    }

    const db = getPool();
    const [result] = await db.execute(
      'INSERT INTO clientes (name, email, phone, address, notes, purchases, totalSpent) VALUES (?, ?, ?, ?, ?, 0, 0)',
      [name, email || '', phone || '', address || '', notes || '']
    );

    const [rows] = await db.execute('SELECT * FROM clientes WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear cliente', details: err.message });
  }
});

// PUT /api/clientes/:id - Actualizar un cliente
router.put('/:id', async (req, res) => {
  try {
    const db = getPool();
    const [existing] = await db.execute('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const current = existing[0];
    const { name, email, phone, address, notes } = req.body;

    await db.execute(
      'UPDATE clientes SET name = ?, email = ?, phone = ?, address = ?, notes = ? WHERE id = ?',
      [
        name !== undefined ? name : current.name,
        email !== undefined ? email : current.email,
        phone !== undefined ? phone : current.phone,
        address !== undefined ? address : current.address,
        notes !== undefined ? notes : current.notes,
        req.params.id,
      ]
    );

    const [rows] = await db.execute('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar cliente', details: err.message });
  }
});

// DELETE /api/clientes/:id - Eliminar un cliente
router.delete('/:id', async (req, res) => {
  try {
    const db = getPool();
    const [existing] = await db.execute('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    await db.execute('DELETE FROM clientes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Cliente eliminado', client: existing[0] });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar cliente', details: err.message });
  }
});

module.exports = router;
