const express = require('express');
const router = express.Router();
const db = require('../db/event_db');

// GET /api/admin/events - list every event, whatever its status
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT
                e.event_id,
                e.name,
                e.event_date,
                e.event_time,
                e.location,
                e.ticket_price,
                e.is_free,
                e.is_suspended,
                c.name AS category_name
             FROM events e
             JOIN categories c ON e.category_id = c.category_id
             ORDER BY e.event_date DESC`
        );
        res.json(rows.map(addStatus));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve events.' });
    }
});

// GET /api/admin/events/:id - one event with all of its registrations
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT e.*, DATE_FORMAT(e.event_date, '%Y-%m-%d') AS event_date
             FROM events e
             WHERE e.event_id = ?`,
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        const [registrations] = await db.query(
            'SELECT * FROM registrations WHERE event_id = ? ORDER BY registration_date DESC',
            [req.params.id]
        );

        const event = addStatus(rows[0]);
        event.registrations = registrations;
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve event details.' });
    }
});

// adds the status (upcoming, past or suspended) to the event
function addStatus(event) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.event_date);
    let status = eventDate >= today ? 'upcoming' : 'past';
    if (event.is_suspended) {
        status = 'suspended';
    }
    return {
        ...event,
        status: status
    };
}


module.exports = router;
