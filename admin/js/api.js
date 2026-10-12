// URL of the API deployed on cPanel - change this to your own cPanel API address
const DEPLOYED_API_URL = 'https://24701154.it.scu.edu.au/charityapi/api';

// Use the local API while testing on this computer, otherwise use the deployed API
const API_BASE_URL = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api'
    : DEPLOYED_API_URL;

// helper functions
async function fetchJSON(path) {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) {
        throw new Error(`API request failed (${response.status})`);
    }
    return response.json();
}

// Event dates come from the API as 'YYYY-MM-DD', so read them as a local date (not UTC)
function toDate(dateString) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const parts = dateString.split('-');
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date(dateString);
}

function formatDate(dateString) {
    return toDate(dateString).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

// date and time, used for when tickets were purchased
function formatDateTime(dateString) {
    return toDate(dateString).toLocaleString('en-AU', {
        day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit'
    });
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
