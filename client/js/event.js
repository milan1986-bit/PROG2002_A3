document.addEventListener('DOMContentLoaded', loadEventDetails);

async function loadEventDetails() {
    const container = document.getElementById('event-detail-container');
    const errorBox = document.getElementById('error-message');

    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');

    if (!eventId) {
        errorBox.textContent = 'No event was specified. Please go back and select an event.';
        errorBox.style.display = 'block';
        return;
    }

    try {
        const event = await fetchJSON(`/events/${eventId}`);
        renderEvent(event);
    } catch (err) {
        console.error(err);
        container.innerHTML = '';
        errorBox.textContent = 'Unable to load this event. It may no longer be available, or the API server may not be running.';
        errorBox.style.display = 'block';
    }
}

function renderEvent(event) {
    document.title = `${event.name} - Charity Events`;

    const statusLabel = event.status === 'upcoming' ? 'Upcoming' : 'Past';
    const progressPct = event.fundraising_goal > 0
        ? Math.min(100, Math.round((event.current_progress / event.fundraising_goal) * 100))
        : 0;

    const container = document.getElementById('event-detail-container');
    container.innerHTML = `
        <article class="event-detail">
            <img src="${event.image_url || 'https://placehold.co/900x400?text=Charity+Event'}" alt="${event.name}">
            <div class="event-detail-body">
                <span class="badge ${event.status}">${statusLabel}</span>
                <span class="badge category">${event.category_name}</span>
                <h1>${event.name}</h1>
                <p class="event-meta">${formatDate(event.event_date)}${event.event_time ? ' at ' + event.event_time.slice(0, 5) : ''} &middot; ${event.location}</p>
                <p>${event.full_description || event.short_description}</p>

                <div class="detail-grid">
                    <div class="info-card">
                        <h3>Fundraising Progress</h3>
                        <p>$${Number(event.current_progress).toLocaleString()} raised of $${Number(event.fundraising_goal).toLocaleString()} goal (${progressPct}%)</p>
                        <div class="progress-bar-track">
                            <div class="progress-bar-fill" style="width: ${progressPct}%;"></div>
                        </div>
                        <p class="event-meta">Hosted by ${event.organisation_name}</p>
                    </div>

                    <div class="info-card">
                        <h3>Ticket Information</h3>
                        <p class="price-tag">${formatPrice(event)}</p>
                        <a id="register-btn" class="btn btn-primary register-link" href="register.html?id=${event.event_id}">Register</a>
                    </div>
                </div>

                <div class="info-card weather-card">
                    <h3>Weather Forecast</h3>
                    <div id="weather"><p class="event-meta">Loading forecast...</p></div>
                </div>

                <h2 class="section-title registrations-title">Registrations</h2>
                <div id="registrations"></div>
            </div>
        </article>
    `;

    showRegistrations(event.registrations);
    showWeather(event);
}

// shows the list of registrations
function showRegistrations(registrations) {
    const div = document.getElementById('registrations');
    div.innerHTML = '';

    if (registrations.length === 0) {
        div.innerHTML = '<p class="empty-state">No registrations yet. Be the first to register!</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML = '<tr><th>Name</th><th>Tickets</th><th>Registration date</th></tr>';

    registrations.forEach(registration => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = registration.full_name;
        row.appendChild(nameCell);

        const ticketsCell = document.createElement('td');
        ticketsCell.textContent = registration.tickets;
        row.appendChild(ticketsCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = formatDate(registration.registration_date);
        row.appendChild(dateCell);

        table.appendChild(row);
    });

    div.appendChild(table);
}
