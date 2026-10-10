const express = require('express');
const router = express.Router();
const db = require('../db/event_db');

// POST /api/admin/categories - body: { name }
router.post('/', async (req, res) => {
    const name = req.body.name;
    if (!name) {
        return res.status(400).json({ insert: 'error', message: 'Category name is required.' });
    }

    try {
        const [existing] = await db.query('SELECT category_id FROM categories WHERE name = ?', [name]);
        if (existing.length > 0) {
            return res.status(409).json({ insert: 'error', message: 'This category already exists.' });
        }

        const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
        res.status(201).json({ insert: 'success', category_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ insert: 'error', message: 'Failed to save the category.' });
    }
});

// PUT /api/admin/categories/:id - body: { name }
router.put('/:id', async (req, res) => {
    const name = req.body.name;
    if (!name) {
        return res.status(400).json({ update: 'error', message: 'Category name is required.' });
    }

    try {
        const [existing] = await db.query(
            'SELECT category_id FROM categories WHERE name = ? AND category_id <> ?',
            [name, req.params.id]
        );
        if (existing.length > 0) {
            return res.status(409).json({ update: 'error', message: 'Another category already has this name.' });
        }

        const [result] = await db.query('UPDATE categories SET name = ? WHERE category_id = ?', [name, req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ update: 'error', message: 'Category not found.' });
        }
        res.json({ update: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ update: 'error', message: 'Failed to update the category.' });
    }
});

// DELETE /api/admin/categories/:id - not allowed while events still use the category
router.delete('/:id', async (req, res) => {
    try {
        const [events] = await db.query('SELECT event_id FROM events WHERE category_id = ?', [req.params.id]);
        if (events.length > 0) {
            return res.status(409).json({
                delete: 'error',
                message: `This category cannot be deleted because ${events.length} event(s) use it.`
            });
        }

        const [result] = await db.query('DELETE FROM categories WHERE category_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ delete: 'error', message: 'Category not found.' });
        }
        res.json({ delete: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ delete: 'error', message: 'Failed to delete the category.' });
    }
});

module.exports = router;
