const client = require('./client.js');
const express = require('express');
const bp = require('body-parser');
const util = require("util");
const app = express();

const pgp = require('pg-promise')();
const db = pgp(client.connection);

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.listen(8080, () => {
    console.log('Server started on port 8080');
});

const database = 'runes';

// const db.query = util.promisify(client.client.query);
app.get('/runes', (req, res) => {
    db.query('SELECT * FROM ' + database)
        .then(pgres => {
            console.log(pgres);
            res.send(pgres);
        })
        .catch(err => console.log(err))
});


// This code should be atomic. maybe use prosify.all()
app.post('/runes', async (req, res) => {
    const runes = req.body;
    console.log(runes);
    for (const rune of runes) {
        console.log(rune);
        const count = await db.query('SELECT * FROM ' + database + ' WHERE champion_id = $1 AND lane = $2 AND primaryStyleID = $3 AND primary1 = $4 AND primary2 = $5 AND primary3 =$6 AND primary4 =$7 AND subStyleId =$8 AND sub1 =$9 AND sub2 =$10', [rune.champion_id, rune.lane, rune.primarystyleid, rune.primary1, rune.primary2, rune.primary3, rune.primary4, rune.substyleid, rune.sub1, rune.sub2])
            .then(pgres => pgres.length)
            .catch(err => console.log(err));
        if (count > 0)
            await db.query('UPDATE ' + database + ' SET count = count + 1 WHERE champion_id = $1 AND lane = $2 AND primaryStyleID = $3 AND primary1 = $4 AND primary2 = $5 AND primary3 =$6 AND primary4 =$7 AND subStyleId =$8 AND sub1 =$9 AND sub2 =$10', [rune.champion_id, rune.lane, rune.primarystyleid, rune.primary1, rune.primary2, rune.primary3, rune.primary4, rune.substyleid, rune.sub1, rune.sub2])
                .catch(err => console.log(err));

        else
            await db.query('insert into ' + database + ' (champion_id,lane,primaryStyleID, primary1, primary2, primary3, primary4, subStyleId, sub1, sub2) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [rune.champion_id, rune.lane, rune.primarystyleid, rune.primary1, rune.primary2, rune.primary3, rune.primary4, rune.substyleid, rune.sub1, rune.sub2])
                .catch(err => console.log(err));
        if (rune.win == 1)
            await db.query('UPDATE ' + database + ' SET win = win + 1 WHERE champion_id = $1 AND lane = $2 AND primaryStyleID = $3 AND primary1 = $4 AND primary2 = $5 AND primary3 =$6 AND primary4 =$7 AND subStyleId =$8 AND sub1 =$9 AND sub2 =$10', [rune.champion_id, rune.lane, rune.primarystyleid, rune.primary1, rune.primary2, rune.primary3, rune.primary4, rune.substyleid, rune.sub1, rune.sub2])
                .catch(err => console.log(err));
        let game_count = await db.query('SELECT * FROM ' + database + ' WHERE champion_id = $1 AND lane = $2 AND primaryStyleID = $3 AND primary1 = $4 AND primary2 = $5 AND primary3 =$6 AND primary4 =$7 AND subStyleId =$8 AND sub1 =$9 AND sub2 =$10', [rune.champion_id, rune.lane, rune.primarystyleid, rune.primary1, rune.primary2, rune.primary3, rune.primary4, rune.substyleid, rune.sub1, rune.sub2])
            .then(pgres => pgres[0].count);
        let win = await db.query('SELECT * FROM ' + database + ' WHERE champion_id = $1 AND lane = $2 AND primaryStyleID = $3 AND primary1 = $4 AND primary2 = $5 AND primary3 =$6 AND primary4 =$7 AND subStyleId =$8 AND sub1 =$9 AND sub2 =$10', [rune.champion_id, rune.lane, rune.primarystyleid, rune.primary1, rune.primary2, rune.primary3, rune.primary4, rune.substyleid, rune.sub1, rune.sub2])
            .then(pgres => pgres[0].win);
        console.log(game_count);
        console.log(win);
        let winrate = win * 100 / game_count;
        console.log(winrate);
        await db.query('UPDATE ' + database + ' SET winrate = $11 WHERE champion_id = $1 AND lane = $2 AND primaryStyleID = $3 AND primary1 = $4 AND primary2 = $5 AND primary3 =$6 AND primary4 =$7 AND subStyleId =$8 AND sub1 =$9 AND sub2 =$10', [rune.champion_id, rune.lane, rune.primarystyleid, rune.primary1, rune.primary2, rune.primary3, rune.primary4, rune.substyleid, rune.sub1, rune.sub2, winrate])
            .catch(err => console.log(err));
    }
    res.send('ok');
});

Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)];
}


app.get('/runes/:id/:lane', async (req, res) => {
    const rune = req.params.id;
    const lane = req.params.lane;
    db.query('SELECT * FROM ' + database + ' WHERE champion_id = $1 AND lane = $2 ORDER BY count', [rune, lane])
        .then(pgres => {
            if (pgres.length > 0) {
                pgres[0]["shard1"] = [5008, 5005, 5007].sample()
                pgres[0]["shard2"] = [5008, 5002, 5003].sample()
                pgres[0]["shard3"] = [5001, 5002, 5003].sample()
            }
            res.send(pgres);
        })
        .catch(err => console.log(err));
});

app.delete('/runes/:id/:lane/delete', (req, res) => {
    const rune = req.params.id;
    const lane = req.params.lane;
    db.query('DELETE FROM ' + database + ' WHERE champion_id = $1 AND lane = $2', [rune, lane], (err, pgres) => {
        if (err) {
            console.log(err);
        } else {
            console.log(pgres);
            res.send(pgres);
        }
    })
});
