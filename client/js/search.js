document.addEventListener('DOMContentLoaded', () => {
    loadCategories();

    document.getElementById('search-form').addEventListener('submit', handleSearch);
    document.getElementById('clear-filters').addEventListener('click', handleClearFilters);
});

async function loadCategories() {
    try {
        const categories = await fetchJSON('/categories');
        const select = document.getElementById('category');
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.category_id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    } catch (err) {
        console.error('Failed to load categories', err);
    }
}

async function handleSearch(event) {
    event.preventDefault();
    hideError();

    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value.trim();
    const category = document.getElementById('category').value;

    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (location) params.append('location', location);
    if (category) params.append('category', category);

    const resultsGrid = document.getElementById('results-grid');
    resultsGrid.innerHTML = '<p class="empty-state">Searching...</p>';

    try {
        const events = await fetchJSON(`/events/search?${params.toString()}`);

        if (events.length === 0) {
            resultsGrid.innerHTML = '';
            showError('No events match your search criteria. Try adjusting your filters.');
            return;
        }

        resultsGrid.innerHTML = events.map(buildEventCard).join('');
    } catch (err) {
        console.error(err);
        resultsGrid.innerHTML = '';
        showError('Something went wrong while searching. Please make sure the API server is running and try again.');
    }
}

function handleClearFilters() {
    document.getElementById('search-form').reset();
    document.getElementById('results-grid').innerHTML = '';
    hideError();
}

function showError(message) {
    const box = document.getElementById('error-message');
    box.textContent = message;
    box.style.display = 'block';
}

function hideError() {
    const box = document.getElementById('error-message');
    box.style.display = 'none';
    box.textContent = '';
}
