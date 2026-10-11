// Fills the Category and Organisation drop-down lists from the API
async function loadDropdowns() {
    const categories = await fetchJSON('/categories');
    const categorySelect = document.getElementById('txtCategory');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.category_id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });

    const organisations = await fetchJSON('/organisations');
    const orgSelect = document.getElementById('txtOrg');
    organisations.forEach(org => {
        const option = document.createElement('option');
        option.value = org.org_id;
        option.textContent = org.name;
        orgSelect.appendChild(option);
    });
}

// Gets the values from the form using DOM and puts them in one object
function getFormData() {
    return {
        name: document.getElementById('txtName').value.trim(),
        category_id: document.getElementById('txtCategory').value,
        org_id: document.getElementById('txtOrg').value,
        short_description: document.getElementById('txtShortDesc').value.trim(),
        full_description: document.getElementById('txtFullDesc').value.trim(),
        event_date: document.getElementById('txtDate').value,
        event_time: document.getElementById('txtTime').value,
        location: document.getElementById('txtLocation').value.trim(),
        latitude: document.getElementById('txtLatitude').value,
        longitude: document.getElementById('txtLongitude').value,
        image_url: document.getElementById('txtImage').value.trim(),
        ticket_price: document.getElementById('txtPrice').value,
        is_free: document.getElementById('chkFree').checked,
        fundraising_goal: document.getElementById('txtGoal').value,
        current_progress: document.getElementById('txtProgress').value,
        is_suspended: document.getElementById('chkSuspended').checked
    };
}

// Validates the form data. Returns true if it is valid, otherwise shows an alert and returns false.
function checkFormData(data) {
    if (!data.name || !data.category_id || !data.org_id || !data.short_description ||
        !data.event_date || !data.location) {
        alert('Please fill in all required fields (marked with *).');
        return false;
    }
    if (!data.is_free && (data.ticket_price === '' || isNaN(data.ticket_price) || data.ticket_price <= 0)) {
        alert('Please enter a ticket price greater than 0, or tick "Free event".');
        return false;
    }
    if (isNaN(data.fundraising_goal) || data.fundraising_goal < 0) {
        alert('Fundraising goal must be 0 or more.');
        return false;
    }
    if (isNaN(data.current_progress) || data.current_progress < 0) {
        alert('Raised so far must be 0 or more.');
        return false;
    }
    if (data.latitude !== '' && (data.latitude < -90 || data.latitude > 90)) {
        alert('Latitude must be between -90 and 90.');
        return false;
    }
    if (data.longitude !== '' && (data.longitude < -180 || data.longitude > 180)) {
        alert('Longitude must be between -180 and 180.');
        return false;
    }
    return true;
}
