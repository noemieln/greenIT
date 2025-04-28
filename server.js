const express = require('express'); 
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Logger des requêtes
app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    next();
});

// Middleware JSON
app.use(express.json());

// Connexion BDD
const db = new sqlite3.Database('./database/disney.db', (err) => {
    if (err) console.error('Erreur de connexion à la BDD', err);
    else console.log('Connecté à la base de données SQLite');
});

// Création table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS figurines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        description TEXT,
        image_url TEXT
    )`);
});

// Routes API
app.get('/api/figurines', (req, res) => {
    db.all("SELECT * FROM figurines", [], (err, rows) => {
        if (err) res.status(400).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/figurines', (req, res) => {
    const { nom, description, image_url } = req.body;
    db.run(`INSERT INTO figurines (nom, description, image_url) VALUES (?, ?, ?)`,
        [nom, description, image_url],
        function(err) {
            if (err) res.status(400).json({ error: err.message });
            else res.json({ id: this.lastID });
        });
});

app.delete('/api/figurines/:id', (req, res) => {
    db.run(`DELETE FROM figurines WHERE id = ?`, [req.params.id], function(err) {
        if (err) res.status(400).json({ error: err.message });
        else res.json({ message: 'Figurine supprimée' });
    });
});

// 🚨 Nouvelle route POST pour modifier
app.post('/api/figurines/:id/update', (req, res) => {
    console.log(`Requête UPDATE (POST) reçue pour l'ID : ${req.params.id}`);
    const { nom, description, image_url } = req.body;
    const id = req.params.id;

    db.run(`UPDATE figurines SET nom = ?, description = ?, image_url = ? WHERE id = ?`,
        [nom, description, image_url, id],
        function(err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ message: 'Figurine modifiée avec succès via POST' });
            }
        }
    );
});

// Static + 404
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
    res.status(404).json({ error: "Route non trouvée", methode: req.method, chemin: req.url });
});

// Lancement serveur
app.listen(PORT, () => {
    console.log(`🔥 Serveur lancé sur http://localhost:${PORT}`);
});
