const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connexion à la BDD
const db = new sqlite3.Database('./database/site.db', (err) => {
    if (err) console.error('Erreur de connexion à la BDD', err);
    else console.log('Connecté à la base de données SQLite');
});

// Création des tables si elles n'existent pas
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS figurines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        description TEXT,
        image_url TEXT
    )`);
});

// Routes API CRUD utilisateurs
app.get('/api/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) res.status(400).json({ error: err.message });
        else res.json(rows);
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// Ajouter un utilisateur
app.post('/api/users', (req, res) => {
    const { username, email, role } = req.body;
    db.run(`INSERT INTO users (username, email, role) VALUES (?, ?, ?)`,
        [username, email, role],
        function(err) {
            if (err) res.status(400).json({ error: err.message });
            else res.json({ id: this.lastID });
        });
});

// Modifier un utilisateur
app.put('/api/users/:id', (req, res) => {
    const { username, email, role } = req.body;
    db.run(`UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?`,
        [username, email, role, req.params.id],
        function(err) {
            if (err) res.status(400).json({ error: err.message });
            else res.json({ message: 'Utilisateur modifié' });
        });
});

// Supprimer un utilisateur
app.delete('/api/users/:id', (req, res) => {
    db.run(`DELETE FROM users WHERE id = ?`, [req.params.id], function(err) {
        if (err) res.status(400).json({ error: err.message });
        else res.json({ message: 'Utilisateur supprimé' });
    });
});
