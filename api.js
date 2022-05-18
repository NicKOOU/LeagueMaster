const axios = require('axios').default;
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
    client.client.query('SELECT * FROM runes WHERE champion_id = $1 AND lane = $2 AND primaryStyleID = $3 AND primary1 = $4 AND primary2 = $5 AND primary3 =$6 AND primary4 =$7 AND subStyleId =$8 AND sub1 =$9 AND sub2 =$10', [rune.champion_id, rune.lane, rune.primarystyleid, rune.primary1, rune.primary2, rune.primary3, rune.primary4, rune.substyleid, rune.sub1, rune.sub2], (err, pgres) => {
        if (err) {
            console.log(err);
            return;
        }
        if (pgres.rows.length > 0) {
            client.client.query('UPDATE runes SET count = count + 1 WHERE champion_id = $1 AND lane = $2 AND primaryStyleID = $3 AND primary1 = $4 AND primary2 = $5 AND primary3 =$6 AND primary4 =$7 AND subStyleId =$8 AND sub1 =$9 AND sub2 =$10', [rune.champion_id, rune.lane, rune.primarystyleid, rune.primary1, rune.primary2, rune.primary3, rune.primary4, rune.substyleid, rune.sub1, rune.sub2], (err, pgres) => {
                if (err)
                    console.log(err);
            })
            return;
        }
        if (pgres.rows.length > 0 && rune.win == true) {
            client.client.query('UPDATE runes SET win = win + 1 WHERE champion_id = $1 AND lane = $2 AND primaryStyleID = $3 AND primary1 = $4 AND primary2 = $5 AND primary3 =$6 AND primary4 =$7 AND subStyleId =$8 AND sub1 =$9 AND sub2 =$10', [rune.champion_id, rune.lane, rune.primarystyleid, rune.primary1, rune.primary2, rune.primary3, rune.primary4, rune.substyleid, rune.sub1, rune.sub2], (err, pgres) => {
                if (err)
                    console.log(err);
            })
            return;
        }
        if (pgres.rows.length > 0) {
            client.client.query('UPDATE runes SET winrate = win / count * 100 WHERE champion_id = $1 AND lane = $2 AND primaryStyleID = $3 AND primary1 = $4 AND primary2 = $5 AND primary3 =$6 AND primary4 =$7 AND subStyleId =$8 AND sub1 =$9 AND sub2 =$10', [rune.champion_id, rune.lane, rune.primarystyleid, rune.primary1, rune.primary2, rune.primary3, rune.primary4, rune.substyleid, rune.sub1, rune.sub2], (err, pgres) => {
                if (err)
                    console.log(err);
            })
            return;
        }
        client.client.query('insert into runes (champion_id,lane,primaryStyleID, primary1, primary2, primary3, primary4, subStyleId, sub1, sub2) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [rune.champion_id, rune.lane, rune.primarystyleid, rune.primary1, rune.primary2, rune.primary3, rune.primary4, rune.substyleid, rune.sub1, rune.sub2], (err, pgres) => {
            if (err) {
                console.log(err);
            } else {
                res.send(rune);
            }
        })
    });
});

Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)];
}


app.get('/runes/:id/:lane', (req, res) => {
    const rune = req.params.id;
    const lane = req.params.lane;
    client.client.query('SELECT * FROM runes WHERE champion_id = $1 AND lane = $2 ORDER BY count, winrate', [rune, lane], (err, pgres) => {
        if (err) {
            console.log(err);
        } else {
            if (pgres.rows.length > 0) {
                pgres.rows[0]["shard1"] = [5008, 5005, 5007].sample()
                pgres.rows[0]["shard2"] = [5008, 5002, 5003].sample()
                pgres.rows[0]["shard3"] = [5001, 5002, 5003].sample()
            }
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