// Charger les figurines au démarrage
window.onload = chargerFigurines;

function chargerFigurines() {
    fetch('/api/figurines')
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
                        <td>
                            <button onclick="supprimerFigurine(${fig.id})">Supprimer</button>
                            <button class="btn-modifier"
                                data-id="${fig.id}"
                                data-nom="${encodeHTML(fig.nom)}"
                                data-description="${encodeHTML(fig.description)}"
                                data-image="${encodeHTML(fig.image_url)}">
                                Modifier
                            </button>
                        </td>
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

// Supprimer une figurine
function supprimerFigurine(id) {
    if(confirm("Tu es sûr de vouloir supprimer cette figurine ?")) {
        fetch(`/api/figurines/${id}`, {
            method: 'DELETE'
        })
        .then(() => chargerFigurines());
    }
}

// Gérer le clic sur Modifier
document.addEventListener('click', function(e) {
    if(e.target && e.target.classList.contains('btn-modifier')) {
        const btn = e.target;
        const id = btn.getAttribute('data-id');
        const nom = btn.getAttribute('data-nom');
        const description = btn.getAttribute('data-description');
        const image_url = btn.getAttribute('data-image');

        modifierFigurine(id, nom, description, image_url);
    }
});

// Modifier une figurine via POST (URL relative)
function modifierFigurine(id, currentNom, currentDescription, currentImage) {
    const nom = prompt("Nom de la figurine :", currentNom);
    const description = prompt("Description :", currentDescription);
    const image_url = prompt("Nom du fichier image :", currentImage);

    if(nom && description && image_url) {
        fetch(`/api/figurines/${id}/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom, description, image_url })
        })
        .then(response => {
            console.log("Status serveur :", response.status);
            if (!response.ok) {
                throw new Error(`Erreur serveur : ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            alert("✅ Figurine modifiée avec succès !");
            chargerFigurines();
        })
        .catch(err => alert("❌ " + err));
    }
}

// Fonction pour éviter les problèmes de caractères spéciaux
function encodeHTML(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}
