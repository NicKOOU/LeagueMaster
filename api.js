const axios = require('axios').default;
axios
const client = require('./client.js');
const express = require('express');
const bp = require('body-parser');
const app = express();
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.listen(8080, () => {
    console.log('Server started on port 8080');
});

app.post('/runes/gameid', (req,res)=>{
    const gameid=req.body;
    // retrieve data from GET /lol/match/v5/matches/{matchId}
    getStats(gameid).then(data => console.log(data));
    console.log(res);
})

function getStats(gameid) {
    return axios({
        proxy: false,
        method: 'get',
        url: "https://europe.api.riotgames.com//lol/match/v5/matches/" + gameid,
        responseType: 'json'

    }).then(response =>
        response.data
    ).catch(error => {
        console.log(error);
    });
}
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

                client.client.query('insert into runes (champion_name,champion_id,lane,primaryStyleID, primary1, primary2, primary3, primary4, subStyleId, sub1, sub2, shard1,shard2,shard3) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)', [rune.champion_name, rune.champion_id, rune.lane, rune.primaryStyleID, rune.primary1, rune.primary2, rune.primary3, rune.primary4, rune.subStyleId, rune.sub1, rune.sub2, rune.shard1, rune.shard2, rune.shard3], (err, pgres) => {
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