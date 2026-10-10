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

module.exports = router;
