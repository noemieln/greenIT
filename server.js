const express = require('express'); 
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// ==========================
// Middleware JSON
// ==========================
app.use(express.json());

// ==========================
// Connexion à la BDD + Création des tables
// ==========================
const db = new sqlite3.Database('./database/site.db', (err) => {
    if (err) console.error('Erreur de connexion à la BDD', err);
    else console.log('Connecté à la base de données SQLite');
});

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

// ==========================
// Routes API CRUD UTILISATEURS
// ==========================
app.get('/api/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) res.status(400).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/users', (req, res) => {
    const { username, email, role } = req.body;
    db.run(`INSERT INTO users (username, email, role) VALUES (?, ?, ?)` ,
        [username, email, role],
        function(err) {
            if (err) res.status(400).json({ error: err.message });
            else res.json({ id: this.lastID });
        });
});

app.put('/api/users/:id', (req, res) => {
    const { username, email, role } = req.body;
    db.run(`UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?` ,
        [username, email, role, req.params.id],
        function(err) {
            if (err) res.status(400).json({ error: err.message });
            else res.json({ message: 'Utilisateur modifié' });
        });
});

app.delete('/api/users/:id', (req, res) => {
    db.run(`DELETE FROM users WHERE id = ?`, [req.params.id], function(err) {
        if (err) res.status(400).json({ error: err.message });
        else res.json({ message: 'Utilisateur supprimé' });
    });
});

// ==========================
// Routes API CRUD FIGURINES
// ==========================
app.get('/api/figurines', (req, res) => {
    db.all("SELECT * FROM figurines", [], (err, rows) => {
        if (err) res.status(400).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/figurines', (req, res) => {
    const { nom, description, image_url } = req.body;
    db.run(`INSERT INTO figurines (nom, description, image_url) VALUES (?, ?, ?)` ,
        [nom, description, image_url],
        function(err) {
            if (err) res.status(400).json({ error: err.message });
            else res.json({ id: this.lastID });
        });
});

app.get('/api/test', (req, res) => {
    res.json({ message: "La route API fonctionne !" });
});

// Supprimer une figurine
app.delete('/api/figurines/:id', (req, res) => {
    db.run(`DELETE FROM figurines WHERE id = ?`, [req.params.id], function(err) {
        if (err) res.status(400).json({ error: err.message });
        else res.json({ message: 'Figurine supprimée' });
    });
});

// Modifier une figurine
app.put('/api/figurines/:id', (req, res) => {
    const { nom, description, image_url } = req.body;
    db.run(`UPDATE figurines SET nom = ?, description = ?, image_url = ? WHERE id = ?`,
        [nom, description, image_url, req.params.id],
        function(err) {
            if (err) res.status(400).json({ error: err.message });
            else res.json({ message: 'Figurine modifiée' });
        });
});
// ==========================
// Middleware STATIC 
// ==========================
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'public')));

// ==========================
// Démarrer le serveur
// ==========================
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
