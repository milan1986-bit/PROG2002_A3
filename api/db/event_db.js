require('dotenv').config();
const mysql = require('mysql2');

// Database: charityevents_db (see schema.sql)
//   organisations  (org_id PK)
//   categories     (category_id PK)
//   events         (event_id PK, org_id FK, category_id FK, latitude, longitude)
//   registrations  (registration_id PK, event_id FK, full_name, email, phone, tickets,
//                   registration_date) - A3: one registration per email per event
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'charityevents_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Return DATE columns (event_date) as 'YYYY-MM-DD' text instead of a JS Date,
    // so the date does not move by one day when the server and browser are in different time zones
    dateStrings: ['DATE']
});

const promisePool = pool.promise();

// Turns a 'YYYY-MM-DD' event date into a Date at local midnight
function toLocalDate(dateString) {
    const parts = String(dateString).slice(0, 10).split('-');
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

// Returns 'upcoming' or 'past' for an event date
function getDateStatus(dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return toLocalDate(dateString) >= today ? 'upcoming' : 'past';
}

module.exports = promisePool;
module.exports.getDateStatus = getDateStatus;
