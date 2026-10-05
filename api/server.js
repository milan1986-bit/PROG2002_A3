// 24410764
// Niven Maina
const express = require('express');
const cors = require('cors');
const eventsRouter = require('./routes/events');
const categoriesRouter = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/events', eventsRouter);
app.use('/api/categories', categoriesRouter);

app.get('/', (req, res) => {
    res.send('Charity Events API is running. Try /api/events');
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Charity Events API listening on http://localhost:${PORT}`);
});
