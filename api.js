const client = require('./client.js');
const express = require('express');
const bp = require('body-parser');
const app = express();
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.listen(8080, () => {
    console.log('Server started on port 8080');
});

app.get('/runes', (req, res) => {
    client.client.query('SELECT * FROM runes', (err, pgres) => {
        if (err) {
            console.log(err);
        } else {
            console.log(pgres.rows);
            res.send(pgres.rows);
            return pgres.rows;
        }
    })
});

app.post('/runes', (req, res) => {
    const rune = req.body;
    client.client.query('SELECT * FROM runes WHERE champion_id = $1 AND lane = $2', [rune.champion_id, rune.lane], (err, pgres) => {
        if (err) {
            console.log(err);
        } else {
            if (pgres.rows.length > 0) {
                res.send('Rune already exists');
            } else {

                client.client.query('insert into runes (champion_name,champion_id,lane,A1R1,A1R2,A1R3,A1R4,A2R1,A2R2,A2R3,A3R1,A3R2,A3R3) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)', [rune.champion_name, rune.champion_id, rune.lane, rune.A1R1, rune.A1R2, rune.A1R3, rune.A1R4, rune.A2R1, rune.A2R2, rune.A2R3, rune.A3R1, rune.A3R2, rune.A3R3], (err, pgres) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(pgres.rows);
                        res.send(rune);
                    }
                })
            }
        }

    });
});

app.get('/runes/:id/:lane', (req, res) => {
    const rune = req.params.id;
    const lane = req.params.lane;
    client.client.query('SELECT * FROM runes WHERE champion_id = $1 AND lane = $2', [rune, lane], (err, pgres) => {
        if (err) {
            console.log(err);
        } else {
            console.log(pgres.rows);
            res.send(pgres.rows);
        }
    })
});

app.delete('/runes/:id/:lane/delete', (req, res) => {
    const rune = req.params.id;
    const lane = req.params.lane;
    client.client.query('DELETE FROM runes WHERE champion_id = $1 AND lane = $2', [rune, lane], (err, pgres) => {
        if (err) {
            console.log(err);
        } else {
            console.log(pgres.rows);
            res.send(pgres.rows);
        }
    })
});