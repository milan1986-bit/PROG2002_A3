// URL of the API deployed on cPanel - change this to your own cPanel API address
const DEPLOYED_API_URL = 'https://YOUR-CPANEL-API-URL/api';

// Use the local API while testing on this computer, otherwise use the deployed API
const API_BASE_URL = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api'
    : DEPLOYED_API_URL;

async function fetchJSON(path) {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) {
        throw new Error(`API request failed (${response.status})`);
    }
    return response.json();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatPrice(event) {
    return event.is_free || Number(event.ticket_price) === 0
        ? 'Free entry'
        : `$${Number(event.ticket_price).toFixed(2)}`;
}

function buildEventCard(event) {
    const statusLabel = event.status === 'upcoming' ? 'Upcoming' : 'Past';
    return `
        <a class="event-card" href="event.html?id=${event.event_id}">
            <img src="${event.image_url || 'https://placehold.co/600x350?text=Charity+Event'}" alt="${event.name}">
            <div class="event-card-body">
                <span class="badge ${event.status}">${statusLabel}</span>
                <h3>${event.name}</h3>
                <span class="badge category">${event.category_name}</span>
                <p class="event-meta">${formatDate(event.event_date)} &middot; ${event.location}</p>
                <p class="price-tag">${formatPrice(event)}</p>
            </div>
        </a>
    `;
}
