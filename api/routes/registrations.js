const express = require('express');
const router = express.Router();
const db = require('../db/event_db');

// POST /api/registrations
router.post('/', async (req, res) => {
    const event_id = req.body.event_id;
    const full_name = req.body.full_name;
    const email = req.body.email;
    const phone = req.body.phone;
    const tickets = Number(req.body.tickets);

    // validation
    if (!event_id || !full_name || !email || !phone) {
        return res.status(400).json({ insert: 'error', message: 'All fields are required.' });
    }
    if (email.indexOf('@') === -1) {
        return res.status(400).json({ insert: 'error', message: 'Please enter a valid email address.' });
    }
    if (isNaN(tickets) || tickets < 1 || tickets > 10) {
        return res.status(400).json({ insert: 'error', message: 'Number of tickets must be between 1 and 10.' });
    }

    try {
        // The event must exist and must not be suspended
        const [events] = await db.query(
            'SELECT event_id, event_date FROM events WHERE event_id = ? AND is_suspended = FALSE',
            [event_id]
        );
        if (events.length === 0) {
            return res.status(404).json({ insert: 'error', message: 'Event not found.' });
        }

        // Registrations are closed once the event date has passed
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(events[0].event_date) < today) {
            return res.status(400).json({ insert: 'error', message: 'This event has already taken place.' });
        }

        // A user (email) can only register once for the same event
        const [existing] = await db.query(
            'SELECT registration_id FROM registrations WHERE event_id = ? AND email = ?',
            [event_id, email]
        );
        if (existing.length > 0) {
            return res.status(409).json({ insert: 'error', message: 'This email address is already registered for this event.' });
        }

        const [result] = await db.query(
            'INSERT INTO registrations (event_id, full_name, email, phone, tickets) VALUES (?, ?, ?, ?, ?)',
            [event_id, full_name, email, phone, tickets]
        );

        res.status(201).json({ insert: 'success', registration_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ insert: 'error', message: 'Failed to save the registration.' });
    }
});

module.exports = router;
