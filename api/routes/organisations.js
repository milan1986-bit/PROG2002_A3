const express = require('express');
const router = express.Router();
const db = require('../db/event_db');

// GET /api/organisations
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT org_id, name FROM organisations ORDER BY name ASC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve organisations.' });
    }
});

module.exports = router;
