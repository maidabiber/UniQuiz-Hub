const express=require('express');
const path=require('path');
const fs=require('fs');
const app=express();
app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/subjects', (req,res) => {
    fs.readFile('subjects.json', 'utf8', (err,data) => {
        if (err) {
            res.status(500).send("Error");
            return
        }
        res.json(JSON.parse(data));
    })
});


app.get('/api/questions', (req, res) => {
    fs.readFile('questions.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Greška pri čitanju fajla");
        }
        res.json(JSON.parse(data)); // salje sav sadrzaj iz pitanja.json
    });
});
app.listen(3000, ()=> {
    console.log("Server na http://localhost:3000");
});
