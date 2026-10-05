document.addEventListener('DOMContentLoaded', loadHomeEvents);

async function loadHomeEvents() {
    const grid = document.getElementById('event-grid');
    const errorBox = document.getElementById('error-message');

    try {
        const events = await fetchJSON('/events');

        if (events.length === 0) {
            grid.innerHTML = '<p class="empty-state">No events are available right now. Please check back soon.</p>';
            return;
        }

        grid.innerHTML = events.map(buildEventCard).join('');
    } catch (err) {
        console.error(err);
        errorBox.textContent = 'Unable to load events right now. Please make sure the API server is running and try again.';
        errorBox.style.display = 'block';
    }
}
