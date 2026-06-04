const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

//Root Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

//doctors api route
app.get('/doctors', (req, res) => {
    db.all('SELECT * FROM DOCTOR', [], (err, rows) => {
        if (err) return res.json(err);
        res.json(rows);
    });
}); 

//patients api route
app.get('/patients', (req, res) => {
    db.all('SELECT * FROM PATIENT', [], (err, rows) => {
        if (err) return res.json(err);
        res.json(rows);
    });
}); 

//consultations api route
app.get('/consult', (req, res) => {
    db.all('SELECT * FROM CONSULTATION', [], (err, rows) => {
        if (err) return res.json(err);
        res.json(rows);
    });
}); 
// app.post('/doctors', (req, res) => {
//     const newItem = req.body.item;
//     doctors.push(newItem);
//     res.json(doctors);       
// });

//Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

