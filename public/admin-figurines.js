// Charger les figurines au démarrage
window.onload = chargerFigurines;

function chargerFigurines() {
    fetch('http://localhost:3000/api/figurines')
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById('tableFigurines');
            table.innerHTML = `
                <tr>
                    <th>ID</th><th>Nom</th><th>Description</th><th>Image</th><th>Actions</th>
                </tr>`;
            data.forEach(fig => {
                table.innerHTML += `
                    <tr>
                        <td>${fig.id}</td>
                        <td>${fig.nom}</td>
                        <td>${fig.description}</td>
                        <td><img src="images/${fig.image_url}" width="80" alt="${fig.nom}"></td>
                        <td><button>Supprimer</button></td>
                    </tr>`;
            });
        });
}


// Ajouter une figurine
function ajouterFigurine() {
    const nom = document.getElementById('nom').value;
    const description = document.getElementById('description').value;
    const image_url = document.getElementById('image_url').value;

    fetch('/api/figurines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, description, image_url })
    })
    .then(() => chargerFigurines());
}
function supprimerFigurine(id) {
    if(confirm("Tu es sûr de vouloir supprimer cette figurine ?")) {
        fetch(`/api/figurines/${id}`, {
            method: 'DELETE'
        })
        .then(() => chargerFigurines());
    }
}
function modifierFigurine(id, currentNom, currentDescription, currentImage) {
    const nom = prompt("Nom de la figurine :", currentNom);
    const description = prompt("Description :", currentDescription);
    const image_url = prompt("Nom du fichier image :", currentImage);

    if(nom && description && image_url) {
        fetch(`/api/figurines/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom, description, image_url })
        })
        .then(() => chargerFigurines());
    }
}
