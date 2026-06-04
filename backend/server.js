const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

//Root Route
app.get('/', (req, res) => {
    res.send('Clinic Consultations Logging System');
});

//Test Route
app.get('/test', (req, res) => {
    db.all('SELECT * FROM DOCTOR', [], (err, rows) => {
        if (err) return res.json(err);
        res.json(rows);
    });
}); 

//Start Server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

