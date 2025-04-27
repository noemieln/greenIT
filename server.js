const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Sert tous les fichiers HTML, CSS, JS, images depuis le dossier public
app.use(cors({
    origin: ['http://localhost:5500', 'http://localhost:3000']
  }));
  

// Connexion à la base de données MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',  
    database: 'disney_db'
  });
  

// Lire les figurines
app.get('/api/figurines', (req, res) => {
  db.query('SELECT * FROM figurines', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Ajouter une figurine
app.post('/api/figurines', (req, res) => {
  const { nom, description, image_url } = req.body;
  const sql = 'INSERT INTO figurines (nom, description, image_url) VALUES (?, ?, ?)';
  db.query(sql, [nom, description, image_url], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send('Figurine ajoutée !');
  });
});

// Supprimer une figurine
app.delete('/api/figurines/:id', (req, res) => {
  const sql = 'DELETE FROM figurines WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('Figurine supprimée');
  });
});

// Lancer le serveur
app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});
