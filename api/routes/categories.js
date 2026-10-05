const express = require('express');
const router = express.Router();
const db = require('../db/event_db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT category_id, name FROM categories ORDER BY name ASC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve categories.' });
    }
});

module.exports = router;
