document.addEventListener('DOMContentLoaded', () => {
    loadDropdowns().catch(error => {
        console.error('Error loading drop-downs', error);
        alert('Failed to load categories. Please make sure the API server is running.');
    });
});

// Validates the form and sends a POST request to the API to insert the new event
function saveEvent() {
    const postData = getFormData();
    if (!checkFormData(postData)) {
        return;
    }

    fetch(API_BASE_URL + '/admin/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.insert === 'success') {
                alert('Event added successfully!');
                document.getElementById('form1').reset(); // to clear the form
            } else if (data.insert === 'error') {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Saving failed. Please make sure the API server is running.');
        });
}
