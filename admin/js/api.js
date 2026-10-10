// Change this to the API's URL after deploying to cPanel
const API_BASE_URL = 'http://localhost:3000/api';

// helper functions
async function fetchJSON(path) {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) {
        throw new Error(`API request failed (${response.status})`);
    }
    return response.json();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatPrice(event) {
    return event.is_free || Number(event.ticket_price) === 0
        ? 'Free'
        : `$${Number(event.ticket_price).toFixed(2)}`;
}

// converts the status from the API to the label shown in the table
function statusLabel(status) {
    if (status === 'upcoming') {
        return 'Active';
    } else if (status === 'past') {
        return 'Past';
    }
    return 'Suspended';
}
