document.addEventListener('DOMContentLoaded', loadEvents);

// Calls the GET API to get the list of all events and shows them in a table
async function loadEvents() {
    const dataDiv = document.getElementById('data');

    try {
        const events = await fetchJSON('/admin/events');
        dataDiv.innerHTML = '';

        if (events.length === 0) {
            dataDiv.innerHTML = '<p class="empty-state">No events found.</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'data-table';
        table.innerHTML = `
            <tr>
                <th>ID</th><th>Event</th><th>Date</th><th>Location</th>
                <th>Category</th><th>Price</th><th>Status</th><th>Actions</th>
            </tr>`;

        events.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.event_id}</td>
                <td><strong>${event.name}</strong></td>
                <td>${formatDate(event.event_date)}</td>
                <td>${event.location}</td>
                <td>${event.category_name}</td>
                <td>${formatPrice(event)}</td>
                <td><span class="badge status-${event.status}">${statusLabel(event.status)}</span></td>
                <td class="actions">
                    <a class="btn btn-small btn-secondary" href="update_event.html?id=${event.event_id}">Edit</a>
                </td>`;
            table.appendChild(row);
        });

        dataDiv.appendChild(table);
    } catch (error) {
        console.error('Error fetching data', error);
        dataDiv.innerHTML = '<p class="empty-state">Failed to load data. Please make sure the API server is running.</p>';
    }
}
