// get the event id from the url
const params = new URLSearchParams(window.location.search);
const eventId = params.get('id');
let selectedEvent = null;

document.addEventListener('DOMContentLoaded', loadEvent);

// Gets the selected event from the API and shows it on the page
async function loadEvent() {
    // The registration date is today's date
    document.getElementById('txtDate').value = formatDate(new Date());

    if (!eventId) {
        showError('No event was selected. Please go back and choose an event.');
        document.getElementById('event-info').innerHTML = '';
        document.getElementById('form1').style.display = 'none';
        return;
    }

    try {
        selectedEvent = await fetchJSON(`/events/${eventId}`);
        document.getElementById('event-info').innerHTML = `
            <p class="event-meta">You are registering for:</p>
            <h2>${selectedEvent.name}</h2>
            <span class="badge category">${selectedEvent.category_name}</span>
            <p><strong>Date:</strong> ${formatDate(selectedEvent.event_date)}${selectedEvent.event_time ? ' at ' + selectedEvent.event_time.slice(0, 5) : ''}</p>
            <p><strong>Location:</strong> ${selectedEvent.location}</p>
            <p><strong>Ticket price:</strong> ${formatPrice(selectedEvent)}</p>
            <p class="event-meta">${selectedEvent.short_description}</p>
            <a href="event.html?id=${selectedEvent.event_id}">&larr; Back to event details</a>
        `;

        if (selectedEvent.status === 'past') {
            showError('This event has already taken place, so registration is closed.');
            document.getElementById('form1').style.display = 'none';
        }
    } catch (err) {
        console.error(err);
        document.getElementById('event-info').innerHTML = '';
        document.getElementById('form1').style.display = 'none';
        showError('Unable to load this event. It may no longer be available, or the API server may not be running.');
    }
}

// Validates the form and sends the registration to the API (POST)
function validateForm() {
    // Get values from the form using DOM
    const fullName = document.getElementById('txtName').value.trim();
    const email = document.getElementById('txtEmail').value.trim();
    const phone = document.getElementById('txtPhone').value.trim();
    const tickets = document.getElementById('txtTickets').value;

    // Validate the form
    if (!fullName || !email || !phone || !tickets) {
        alert('All fields are required!');
        return;
    }
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        alert('Please enter a valid email address.');
        return;
    }
    if (phone.length < 8) {
        alert('Please enter a valid phone number (at least 8 digits).');
        return;
    }
    if (isNaN(tickets) || tickets < 1 || tickets > 10) {
        alert('Number of tickets must be between 1 and 10.');
        return;
    }

    // Create the data (JSON) to send in the POST request
    const postData = {
        event_id: eventId,
        full_name: fullName,
        email: email,
        phone: phone,
        tickets: tickets
    };

    // Send the POST request to the API
    fetch(API_BASE_URL + '/registrations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.insert === 'success') {
                showConfirmation(fullName, tickets);
            } else if (data.insert === 'error') {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Registration failed. Please make sure the API server is running.');
        });
}

// Hides the form and shows a confirmation message with links to continue
function showConfirmation(fullName, tickets) {
    document.getElementById('form1').reset();
    document.getElementById('form1').style.display = 'none';

    const total = selectedEvent.is_free ? 0 : Number(selectedEvent.ticket_price) * tickets;

    const confirmation = document.getElementById('confirmation');
    confirmation.innerHTML = `
        <h2>Thank you, ${fullName}!</h2>
        <p>Your registration for <strong>${selectedEvent.name}</strong> was successful.</p>
        <p>Tickets: ${tickets} &middot; Total: ${total === 0 ? 'Free' : '$' + total.toFixed(2)}</p>
        <p>
            <a class="btn btn-primary" href="event.html?id=${eventId}">Back to event</a>
            <a class="btn btn-secondary" href="index.html">Browse more events</a>
        </p>
    `;
    confirmation.style.display = 'block';
}

function showError(message) {
    const box = document.getElementById('error-message');
    box.textContent = message;
    box.style.display = 'block';
}
