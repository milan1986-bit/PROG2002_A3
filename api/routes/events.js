const express = require('express');
const router = express.Router();
const db = require('../db/event_db');

const EVENT_LIST_QUERY = `
    SELECT
        e.event_id,
        e.name,
        e.short_description,
        e.event_date,
        e.event_time,
        e.location,
        e.image_url,
        e.ticket_price,
        e.is_free,
        c.name AS category_name,
        o.name AS organisation_name
    FROM events e
    JOIN categories c ON e.category_id = c.category_id
    JOIN organisations o ON e.org_id = o.org_id
    WHERE e.is_suspended = FALSE
`;

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`${EVENT_LIST_QUERY} ORDER BY e.event_date ASC`);
        const events = rows.map(addStatus);
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve events.' });
    }
});

router.get('/search', async (req, res) => {
    try {
        const { date, location, category } = req.query;
        let query = EVENT_LIST_QUERY;
        const params = [];

        if (date) {
            query += ' AND e.event_date = ?';
            params.push(date);
        }
        if (location) {
            query += ' AND e.location LIKE ?';
            params.push(`%${location}%`);
        }
        if (category) {
            query += ' AND c.category_id = ?';
            params.push(category);
        }
        query += ' ORDER BY e.event_date ASC';

        const [rows] = await db.query(query, params);
        const events = rows.map(addStatus);
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to search events.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT
                e.*,
                c.name AS category_name,
                o.name AS organisation_name,
                o.mission_statement,
                o.contact_email,
                o.contact_phone
             FROM events e
             JOIN categories c ON e.category_id = c.category_id
             JOIN organisations o ON e.org_id = o.org_id
             WHERE e.event_id = ? AND e.is_suspended = FALSE`,
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        res.json(addStatus(rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve event details.' });
    }
});

function addStatus(event) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.event_date);
    return {
        ...event,
        status: eventDate >= today ? 'upcoming' : 'past'
    };
}

module.exports = router;
