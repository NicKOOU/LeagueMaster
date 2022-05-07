const client = require('./client.js');
const express = require('express');
const bp = require('body-parser');
const app = express();
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.listen(8080, () => {
    console.log('Server started on port 3000');
});

app.get('/runes', (req,res) => {
    client.client.query('SELECT * FROM runes', (err, pgres) => {
        if (err) {
            console.log(err);
        } else {
            console.log(pgres.rows);
            res.send(pgres.rows);
        }
    })
});

app.post('/runes', (req, res) => {
    const rune = req.body;
    console.log(rune);
    client.client.query('insert into runes (champion_name,champion_id,lane,rune1,rune2,rune3,rune4,rune5,rune6) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [rune.champion_name, rune.champion_id, rune.lane, rune.rune1, rune.rune2, rune.rune3, rune.rune4, rune.rune5, rune.rune6], (err, pgres) => {
        if (err) {
            console.log(err);
        } else {
            console.log(pgres.rows);
            res.send(rune);
        }
    })
});