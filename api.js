const client = require('./client.js');
const express = require('express');
const bp = require('body-parser');
const util = require("util");
const { default: axios } = require('axios');
const { send } = require('express/lib/response');
const app = express();

const pgp = require('pg-promise')();
const db = pgp(client.connection);

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.listen(8080, () => {
    console.log('Server started on port 8080');
});

const database = 'runes'; // enter the name of your primary database
const gameid_db = 'games'; // enter the name of your secondary database (gameids)

class rune {
    constructor(champion_id, lane, primarystyleid, primary1, primary2, primary3, primary4, substyleid, sub1, sub2, win) {
        this.champion_id = champion_id;
        this.lane = lane;
        this.primarystyleid = primarystyleid;
        this.primary1 = primary1;
        this.primary2 = primary2;
        this.primary3 = primary3;
        this.primary4 = primary4;
        this.substyleid = substyleid;
        this.sub1 = sub1;
        this.sub2 = sub2;
        this.win = win;
    }
    async send() {
        const count = await db.query('SELECT * FROM runes WHERE champion_id = $1 AND lane = $2 AND primaryStyleID = $3 AND primary1 = $4 AND primary2 = $5 AND primary3 =$6 AND primary4 =$7 AND subStyleId =$8 AND sub1 =$9 AND sub2 =$10', [this.champion_id, this.lane, this.primarystyleid, this.primary1, this.primary2, this.primary3, this.primary4, this.substyleid, this.sub1, this.sub2])
            .then(pgres => pgres.length)
            .catch(err => console.log(err));
        if (count > 0)
            await db.query('UPDATE runes SET count = count + 1 WHERE champion_id = $1 AND lane = $2 AND primaryStyleID = $3 AND primary1 = $4 AND primary2 = $5 AND primary3 =$6 AND primary4 =$7 AND subStyleId =$8 AND sub1 =$9 AND sub2 =$10', [this.champion_id, this.lane, this.primarystyleid, this.primary1, this.primary2, this.primary3, this.primary4, this.substyleid, this.sub1, this.sub2])
                .catch(err => console.log(err));

        else
            await db.query('INSERT into runes (champion_id,lane,primaryStyleID, primary1, primary2, primary3, primary4, subStyleId, sub1, sub2) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [this.champion_id, this.lane, this.primarystyleid, this.primary1, this.primary2, this.primary3, this.primary4, this.substyleid, this.sub1, this.sub2])
                .catch(err => console.log(err));
        if (this.win == true)
            await db.query('UPDATE runes SET win = win + 1 WHERE champion_id = $1 AND lane = $2 AND primaryStyleID = $3 AND primary1 = $4 AND primary2 = $5 AND primary3 =$6 AND primary4 =$7 AND subStyleId =$8 AND sub1 =$9 AND sub2 =$10', [this.champion_id, this.lane, this.primarystyleid, this.primary1, this.primary2, this.primary3, this.primary4, this.substyleid, this.sub1, this.sub2])
                .catch(err => console.log(err));
        let game_count = await db.query('SELECT * FROM runes WHERE champion_id = $1 AND lane = $2 AND primaryStyleID = $3 AND primary1 = $4 AND primary2 = $5 AND primary3 =$6 AND primary4 =$7 AND subStyleId =$8 AND sub1 =$9 AND sub2 =$10', [this.champion_id, this.lane, this.primarystyleid, this.primary1, this.primary2, this.primary3, this.primary4, this.substyleid, this.sub1, this.sub2])
            .then(pgres => pgres[0].count);
        let win = await db.query('SELECT * FROM runes WHERE champion_id = $1 AND lane = $2 AND primaryStyleID = $3 AND primary1 = $4 AND primary2 = $5 AND primary3 =$6 AND primary4 =$7 AND subStyleId =$8 AND sub1 =$9 AND sub2 =$10', [this.champion_id, this.lane, this.primarystyleid, this.primary1, this.primary2, this.primary3, this.primary4, this.substyleid, this.sub1, this.sub2])
            .then(pgres => pgres[0].win);
        let winrate = win * 100 / game_count;
        console.log(winrate);
        await db.query('UPDATE runes SET winrate = $11 WHERE champion_id = $1 AND lane = $2 AND primaryStyleID = $3 AND primary1 = $4 AND primary2 = $5 AND primary3 =$6 AND primary4 =$7 AND subStyleId =$8 AND sub1 =$9 AND sub2 =$10', [this.champion_id, this.lane, this.primarystyleid, this.primary1, this.primary2, this.primary3, this.primary4, this.substyleid, this.sub1, this.sub2, winrate])
            .catch(err => console.log(err));
    }
}

// const db.query = util.promisify(client.client.query);
app.get('/runes', (req, res) => {
    db.query('SELECT * FROM runes')
        .then(pgres => {
            console.log(pgres);
            res.send(pgres);
        })
        .catch(err => console.log(err))
});
function assignlane(ip) {
    if (ip == 'Invalid')
        return "ARAM";
    switch (ip) {
        case "TOP":
            return "top";
        case "JUNGLE":
            return "jungle";
        case "MIDDLE":
            return "middle";
        case "BOTTOM":
            return "bottom";
        case "UTILITY":
            return "utility";
        default:
            return "";
    }
}
async function getgameidsfromdatabase() {
    const gameids = await db.query('SELECT * FROM games')
        .then(pgres => pgres)
        .catch(err => console.log(err));
    return gameids;
}
async function makerunesfromgame() {
    gameids = await getgameidsfromdatabase();
    for (var i = 0; i < gameids.length; i++) {
        const matchid = "EUW1_" + gameids[i].gameid;
        const url = `https://europe.api.riotgames.com/lol/match/v5/matches/` + matchid;
        axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchid}`, {
            headers: {
                'X-Riot-Token': '' // Insert your API key here
            }
        }).then(response => {
            response.data.info.participants.forEach(participant => {
                if (participant.kills + participant.assists > 2 * participant.deaths) {
                    let runee = new rune(participant.championId, assignlane(participant.individualPosition), participant.perks.styles[0].style, participant.perks.styles[0].selections[0].perk, participant.perks.styles[0].selections[1].perk, participant.perks.styles[0].selections[2].perk, participant.perks.styles[0].selections[3].perk, participant.perks.styles[1].style, participant.perks.styles[1].selections[0].perk, participant.perks.styles[1].selections[1].perk, participant.win);
                    runee.send();
                }
            });
        }).catch(err => console.log(err));
        db.query('DELETE FROM games WHERE gameid = $1', [gameids[i].gameid])
            .catch(err => console.log(err));
    }
}

app.post('/runes/gameid', async (req, res) => {
    db.query('INSERT into games (gameid) values ($1)', [req.body.gameid])
        .catch(err => console.log(err));
    res.send("game sent");
});

Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)];
}


app.get('/runes/:id/:lane', async (req, res) => {
    const rune = req.params.id;
    const lane = req.params.lane;
    db.query('SELECT * FROM runes WHERE champion_id = $1 AND lane = $2 ORDER BY count DESC, winrate DESC', [rune, lane])
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
    db.query('DELETE FROM runes WHERE champion_id = $1 AND lane = $2', [rune, lane], (err, pgres) => {
        if (err) {
            console.log(err);
        } else {
            console.log(pgres);
            res.send(pgres);
        }
    })
});
