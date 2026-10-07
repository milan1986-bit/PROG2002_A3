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

// POST /api/admin/events - insert a new event
router.post('/', async (req, res) => {
    const message = validateEvent(req.body);
    if (message) {
        return res.status(400).json({ insert: 'error', message: message });
    }

    try {
        const event = getEventValues(req.body);
        const [result] = await db.query(
            `INSERT INTO events
             (org_id, category_id, name, short_description, full_description, event_date, event_time,
              location, image_url, ticket_price, is_free, fundraising_goal, current_progress,
              is_suspended, latitude, longitude)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            event
        );
        res.status(201).json({ insert: 'success', event_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ insert: 'error', message: 'Failed to save the event.' });
    }
});

// Returns an error message, or an empty string when the data is valid
function validateEvent(body) {
    if (!body.name || !body.category_id || !body.org_id || !body.short_description ||
        !body.event_date || !body.location) {
        return 'Please fill in all required fields.';
    }
    if (isNaN(body.ticket_price || 0) || Number(body.ticket_price || 0) < 0) {
        return 'Ticket price must be 0 or more.';
    }
    if (isNaN(body.fundraising_goal || 0) || Number(body.fundraising_goal || 0) < 0) {
        return 'Fundraising goal must be 0 or more.';
    }
    if (isNaN(body.current_progress || 0) || Number(body.current_progress || 0) < 0) {
        return 'Current progress must be 0 or more.';
    }
    if (isNaN(body.latitude || 0) || isNaN(body.longitude || 0)) {
        return 'Latitude and longitude must be numbers.';
    }
    return '';
}

// Puts the request body values in the same order as the columns in the SQL above
function getEventValues(body) {
    return [
        body.org_id,
        body.category_id,
        body.name,
        body.short_description,
        body.full_description || null,
        body.event_date,
        body.event_time || null,
        body.location,
        body.image_url || null,
        body.is_free ? 0 : Number(body.ticket_price || 0),
        body.is_free ? true : false,
        Number(body.fundraising_goal || 0),
        Number(body.current_progress || 0),
        body.is_suspended ? true : false,
        body.latitude || null,
        body.longitude || null
    ];
}

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
