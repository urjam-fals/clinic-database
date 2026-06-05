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

//consultation api route
app.get('/consult', (req, res) => {
    db.all('SELECT * FROM CONSULTATION', [], (err, rows) => {
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

//CREATE (POST) route to save patient
app.post('/patients', (req, res) => {
    const { patFName, patLName, patBDate, patTelNo } = req.body;

    const sql = `INSERT INTO PATIENT (patFName, patLName, patBDate, patTelNo) VALUES (?, ?, ?, ?)`;

    db.run(sql, [patFName, patLName, patBDate, patTelNo], function(err) {
        if (err) {return res.json(err);}

        res.json({
            message: "Patient added successfully",
            id: this.lastID
        });
    });

}); 

app.put('/patients/:id', (req, res) => {
    const id = req.params.id;

    const { patFName, patLName, patBDate, patTelNo } = req.body;

    const sql = `
        UPDATE PATIENT
        SET patFName=?, patLName=?, patBDate=?, patTelNo=? 
        WHERE patID=?
    `;

    db.run(sql, [patFName, patLName, patBDate, patTelNo, id], function(err){
        if(err) return res.json(err);
        res.json({message:"Patient updated"});
    });
});

app.delete('/patients/:id', (req, res) => {
    const id = req.params.id;

    console.log("Deleting patient ID:", id); // 👈 ADD THIS

    db.run("DELETE FROM PATIENT WHERE patID = ?", [id], function(err) {
        if (err) return res.json(err);
        console.log("Rows deleted:", this.changes); // 👈 ADD THIS
        res.json({message: "Patient deleted"});
    });
});

//CREATE (POST) route to save consultation transaction
app.post('/consult', (req, res) => {
    const {patID, docID, consultDate, diagnosis, prescription} = req.body;

    const sql = `INSERT INTO CONSULTATION (patID, docID, consultDate, diagnosis, prescription) VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [patID, docID, consultDate, diagnosis, prescription], function(err) {
        if (err) {return res.json(err);}

        res.json({
            message: "Consultation added successfully",
            id: this.lastID
        });
    });

}); 

app.put('/consult/:id', (req, res) => {
    const id = req.params.id;

    const {patID, docID, consultDate, diagnosis, prescription} = req.body;

    const sql = `
        UPDATE CONSULTATION
        SET patID=?, docID=?, consultDate=?, diagnosis=?, prescription=?
        WHERE consultID=?
    `;

    db.run(sql, [patID, docID, consultDate, diagnosis, prescription, id], function(err){
        if(err) return res.json(err);
        res.json({message:"Consultation Transaction updated"});
    });
});

app.delete('/consult/:id', (req, res) => {
    const id = req.params.id;

    console.log("Deleting consult ID:", id); // 👈 ADD THIS

    db.run("DELETE FROM CONSULTATION WHERE consultID = ?", [id], function(err) {
        if (err) return res.json(err);
        console.log("Rows deleted:", this.changes); // 👈 ADD THIS
        res.json({message: "Consultation deleted"});
    });
});

app.get('/doctors/inquiry', (req, res) => {

    const spec = req.query.specialization;

    let sqlData = `SELECT docID, docFName, docLName, docSpecial FROM DOCTOR`;
    let sqlCount = `SELECT COUNT(*) AS total FROM DOCTOR`;

    let params = [];

    if(spec) {
        sqlData += ` WHERE docSpecial LIKE ?`;
        sqlCount += ` WHERE docSpecial LIKE ?`;
        params = [`%${spec}%`];
    }

    db.all(sqlData, params, (err, rows) => {
        if (err) return res.json(err);

        db.get(sqlCount, params, (err2, countRow) => {
            if(err2) return res.json(err2);

            res.json({
                data:rows,
                count:countRow.total
            });
        });
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

