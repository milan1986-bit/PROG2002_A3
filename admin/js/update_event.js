// get the event id from the url
const params = new URLSearchParams(window.location.search);
const eventId = params.get('id');

document.addEventListener('DOMContentLoaded', loadEvent);

// Gets the event (and its registrations) from the API and fills in the form
async function loadEvent() {
    if (!eventId) {
        alert('No event was selected.');
        document.getElementById('form1').style.display = 'none';
        return;
    }

    try {
        await loadDropdowns();
        const event = await fetchJSON(`/admin/events/${eventId}`);

        document.getElementById('subtitle').textContent =
            `Event ID ${event.event_id} - status: ${statusLabel(event.status)}. Fields marked * are required.`;
        document.getElementById('txtName').value = event.name;
        document.getElementById('txtCategory').value = event.category_id;
        document.getElementById('txtOrg').value = event.org_id;
        document.getElementById('txtShortDesc').value = event.short_description || '';
        document.getElementById('txtFullDesc').value = event.full_description || '';
        document.getElementById('txtDate').value = event.event_date;
        document.getElementById('txtTime').value = event.event_time ? event.event_time.slice(0, 5) : '';
        document.getElementById('txtLocation').value = event.location;
        document.getElementById('txtLatitude').value = event.latitude || '';
        document.getElementById('txtLongitude').value = event.longitude || '';
        document.getElementById('txtImage').value = event.image_url || '';
        document.getElementById('txtPrice').value = event.ticket_price;
        document.getElementById('chkFree').checked = event.is_free;
        document.getElementById('txtGoal').value = event.fundraising_goal;
        document.getElementById('txtProgress').value = event.current_progress;
        document.getElementById('chkSuspended').checked = event.is_suspended;

        showRegistrations(event.registrations);
    } catch (error) {
        console.error('Error fetching data', error);
        document.getElementById('form1').style.display = 'none';
        document.getElementById('registrations').textContent = 'Failed to load data';
        alert('Failed to load this event. It may not exist, or the API server is not running.');
    }
}

// shows the registrations of this event in a table
function showRegistrations(registrations) {
    const div = document.getElementById('registrations');
    div.innerHTML = '';

    if (registrations.length === 0) {
        div.innerHTML = '<p class="empty-state">No registrations for this event yet.</p>';
        return;
    }

    let totalTickets = 0;
    const table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML = '<tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Tickets</th><th>Registration date</th></tr>';

    registrations.forEach(registration => {
        const row = document.createElement('tr');
        const values = [
            registration.registration_id,
            registration.full_name,
            registration.email,
            registration.phone,
            registration.tickets,
            formatDateTime(registration.registration_date)
        ];
        values.forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });
        table.appendChild(row);
        totalTickets = totalTickets + registration.tickets;
    });

    const summary = document.createElement('p');
    summary.className = 'muted';
    summary.textContent = `${registrations.length} registration(s), ${totalTickets} ticket(s) in total. ` +
        'This event cannot be deleted because it has registrations.';

    div.appendChild(summary);
    div.appendChild(table);
}

// Validates the form and sends a PUT request to the API to update the event
function updateEvent() {
    const putData = getFormData();
    if (!checkFormData(putData)) {
        return;
    }

    fetch(API_BASE_URL + '/admin/events/' + eventId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(putData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.update === 'success') {
                alert('Event updated successfully!');
            } else if (data.update === 'error') {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Update failed. Please make sure the API server is running.');
        });
}
