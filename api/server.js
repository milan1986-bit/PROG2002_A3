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

app.use(cors());
app.use(express.json());

app.use('/api/events', eventsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/organisations', organisationsRouter);
app.use('/api/admin/events', adminEventsRouter);
app.use('/api/admin/categories', adminCategoriesRouter);

app.get('/', (req, res) => {
    res.send('Charity Events API is running. Try /api/events');
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Charity Events API listening on http://localhost:${PORT}`);
});
