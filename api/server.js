// 24410764
// Niven Maina
const express = require('express');
const cors = require('cors');
const eventsRouter = require('./routes/events');
const categoriesRouter = require('./routes/categories');
const registrationsRouter = require('./routes/registrations');
const organisationsRouter = require('./routes/organisations');
const adminEventsRouter = require('./routes/admin_events');
const adminCategoriesRouter = require('./routes/admin_categories');

const app = express();
const PORT = process.env.PORT || 3000;
// On cPanel the app runs in a sub folder (e.g. /charityapi) and gets the full URL,
// so BASE_PATH is set to '/charityapi' there. Locally it is empty.
const BASE_PATH = process.env.BASE_PATH || '';

app.use(cors());
app.use(express.json());

app.use(BASE_PATH + '/api/events', eventsRouter);
app.use(BASE_PATH + '/api/categories', categoriesRouter);
app.use(BASE_PATH + '/api/registrations', registrationsRouter);
app.use(BASE_PATH + '/api/organisations', organisationsRouter);
app.use(BASE_PATH + '/api/admin/events', adminEventsRouter);
app.use(BASE_PATH + '/api/admin/categories', adminCategoriesRouter);

app.get(BASE_PATH + '/', (req, res) => {
    res.send('Charity Events API is running. Try /api/events');
});

app.get(BASE_PATH + '/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Charity Events API listening on http://localhost:${PORT}`);
});
