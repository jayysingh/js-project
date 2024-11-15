const apiEndpoint = 'https://crudcrud.com/api/90cad14461804c19ab38a58ded93e1ad/todo';

document.addEventListener('DOMContentLoaded', loadWebsites);

// Function to load all websites from the API
async function loadWebsites() {
    try {
        const response = await fetch(apiEndpoint);
        const websites = await response.json();
        websites.forEach(website => displayWebsite(website));
    } catch (error) {
        console.error("Failed to load websites:", error);
        alert("Unable to load websites. Please try again.");
    }
}

// Function to add a new website

async function addWebsite() {
    const title = document.getElementById('websiteTitle').value;
    const link = document.getElementById('websiteLink').value;

    if (!title || !link || !link.startsWith("http")) {
        alert("Please enter a valid website title and link (starting with http/https).");
        return;
    }

    const newWebsite = { title, link };

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newWebsite)
        });
        const savedWebsite = await response.json();
        displayWebsite(savedWebsite);
    } catch (error) {
        console.error("Failed to add website:", error);
        alert("Unable to add website. Please try again.");
    }

    document.getElementById('websiteTitle').value = '';
    document.getElementById('websiteLink').value = '';
}

// Function to display a website entry on the screen

function displayWebsite(website) {
    const websitesContainer = document.getElementById('websitesContainer');
    const websiteDiv = document.createElement('div');
    websiteDiv.classList.add('website-item');
    websiteDiv.setAttribute('data-id', website._id);

    websiteDiv.innerHTML = `
        <div>
            <span><strong>${website.title}</strong></span>
            <a href="${website.link}" target="_blank">${website.link}</a>
        </div>
        <button onclick="editWebsite('${website._id}')">Edit</button>
        <button onclick="deleteWebsite('${website._id}')">Delete</button>
    `;

    websitesContainer.appendChild(websiteDiv);
}

// Function to delete a website

async function deleteWebsite(id) {
    try {
        await fetch(`${apiEndpoint}/${id}`, { method: 'DELETE' });
        const websiteDiv = document.querySelector(`div[data-id='${id}']`);
        websiteDiv.remove();
    } catch (error) {
        console.error("Failed to delete website:", error);
        alert("Unable to delete website. Please try again.");
    }
}

// Function to edit a website
async function editWebsite(id) {
    const websiteDiv = document.querySelector(`div[data-id='${id}']`);
    const titleElement = websiteDiv.querySelector('strong');
    const linkElement = websiteDiv.querySelector('a');
    const oldTitle = titleElement.textContent;
    const oldLink = linkElement.href;

    // Prompt the user for new values
    const newTitle = prompt("Enter new website title:", oldTitle);
    const newLink = prompt("Enter new website link (starting with http/https):", oldLink);

    if (!newTitle || !newLink || !newLink.startsWith("http")) {
        alert("Please enter a valid website title and link (starting with http/https).");
        return;
    }

    // Update the website on the server
    try {
        const updatedWebsite = { title: newTitle, link: newLink };
        await fetch(`${apiEndpoint}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedWebsite)
        });

        // Update the displayed title and link
      
        titleElement.textContent = newTitle;
        linkElement.textContent = newLink;
        linkElement.href = newLink;
    } catch (error) {
        console.error("Failed to edit website:", error);
        alert("Unable to edit website. Please try again.");
    }
}
