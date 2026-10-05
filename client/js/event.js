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
                        <button id="register-btn" class="btn btn-primary" style="margin-top: 0.8rem;">Register</button>
                    </div>
                </div>
            </div>
        </article>
    `;

    document.getElementById('register-btn').addEventListener('click', () => {
        alert('This feature is currently under construction.');
    });
}
