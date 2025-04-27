const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // adapte si nécessaire
  password: '',       // mot de passe MySQL
  database: 'disney_db'
});

app.get('/api/figurines', (req, res) => {
  db.query('SELECT * FROM figurines', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});
