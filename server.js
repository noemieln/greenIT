const express = require('express'); 
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connexion à la BDD SQLite
const db = new sqlite3.Database('./database/disney.db', (err) => {
    if (err) console.error('Erreur de connexion à la BDD', err);
    else console.log('Connecté à la base de données SQLite');
});

// Création de la table figurines si elle n'existe pas
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS figurines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        description TEXT,
        image_url TEXT
    )`);
});

// Routes API CRUD Figurines
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

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

