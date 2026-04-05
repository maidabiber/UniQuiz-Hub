const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/data', express.static(path.join(__dirname, 'data')));
app.use('/img', express.static(path.join(__dirname, 'img'))); 
app.use('/html', express.static(path.join(__dirname, 'html')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.get('/api/subjects', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'subjects.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send("Greška pri čitanju subjects.json");
        res.json(JSON.parse(data));
    });
});

app.get('/api/questions', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'questions.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send("Greška pri čitanju questions.json");
        res.json(JSON.parse(data));
    });
});

app.listen(3000, () => console.log("Server na http://localhost:3000"));