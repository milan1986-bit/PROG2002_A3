document.addEventListener('DOMContentLoaded', loadCategories);

// gets the list of categories from the API
async function loadCategories() {
    const dataDiv = document.getElementById('data');

    try {
        const categories = await fetchJSON('/categories');
        dataDiv.innerHTML = '';

        const table = document.createElement('table');
        table.className = 'data-table';
        table.innerHTML = '<tr><th>ID</th><th>Name</th><th>Actions</th></tr>';

        categories.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.category_id}</td>
                <td>${category.name}</td>
                <td class="actions">
                    <a class="btn btn-small btn-secondary" href="#" onclick="renameCategory(${category.category_id}); return false;">Rename</a>
                    <a class="btn btn-small btn-danger" href="#" onclick="deleteCategory(${category.category_id}); return false;">Delete</a>
                </td>`;
            table.appendChild(row);
        });

        dataDiv.appendChild(table);
    } catch (error) {
        console.error('Error fetching data', error);
        dataDiv.textContent = 'Failed to load data';
    }
}

// Sends a POST request to add a new category
function addCategory() {
    const name = document.getElementById('txtCategoryName').value.trim();
    if (!name) {
        alert('Category name is required!');
        return;
    }

    fetch(API_BASE_URL + '/admin/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
    })
        .then(response => response.json())
        .then(data => {
            if (data.insert === 'success') {
                alert('Category added successfully!');
                document.getElementById('form1').reset();
                loadCategories();
            } else if (data.insert === 'error') {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Asks for a new name with prompt() and sends a PUT request
function renameCategory(id) {
    const name = prompt('Enter the new name for this category:', '');
    if (name === null) {
        return;
    }
    if (!name.trim()) {
        alert('Category name is required!');
        return;
    }

    fetch(API_BASE_URL + '/admin/categories/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name.trim() })
    })
        .then(response => response.json())
        .then(data => {
            if (data.update === 'success') {
                alert('Category updated successfully!');
                loadCategories();
            } else if (data.update === 'error') {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// sends a DELETE request to delete the category
function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) {
        return;
    }

    fetch(API_BASE_URL + '/admin/categories/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.delete === 'success') {
                alert('Category deleted successfully!');
                loadCategories();
            } else if (data.delete === 'error') {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
