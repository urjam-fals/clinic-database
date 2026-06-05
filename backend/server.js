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

//CREATE (POST) route to save doctor
app.post('/doctors', (req, res) => {
    const { docFName, docLName, docAddress, docSpecial } = req.body;

    const sql = `INSERT INTO DOCTOR (docFName, docLName, docAddress, docSpecial) VALUES (?, ?, ?, ?)`;

    db.run(sql, [docFName, docLName, docAddress, docSpecial], function(err) {
        if (err) {return res.json(err);}

        res.json({
            message: "Doctor added successfully",
            id: this.lastID
        });
    });

}); 

app.delete('/doctors/:id', (req, res) => {
    const id = req.params.id;

    db.run("DELETE FROM DOCTOR WHERE docID = ?", [id], function(err) {
        if (err) return res.json(err);
        res.json({message: "Doctor deleted"});
    });
});

app.put('/doctors/:id', (req, res) => {
    const id = req.params.id;

    const {docFName, docLName, docAddress, docSpecial} = req.body;

    const sql = `
        UPDATE DOCTOR
        SET docFName=?, docLName=?, docAddress=?, docSpecial=?
        WHERE docID=?
    `;

    db.run(sql, [docFName, docLName, docAddress, docSpecial, id], function(err){
        if(err) return res.json(err);
        res.json({message:"Doctor updated"});
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

