const client = require('./client.js');
const express = require('express');
const bp = require('body-parser');
const util = require("util");
const { default: axios } = require('axios');
const { send, json } = require('express/lib/response');
const { createClient } = require('@supabase/supabase-js');
const { Console } = require('console');
var fs = require('fs');
var https = require('https');
const authenticate = require('league-connect');
const res = require('express/lib/response');
const { deepEqual } = require('assert');
axios.baseURL = "https://yshzrbmwnmyhhbldbvqg.supabase.co";
axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.apikey;

const pgp = require('pg-promise')();
const db = pgp(client.connection);

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
        if (this.champion_id == 0 || this.primarystyleid == 0 || this.substyleid == 0)
            return;
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

class DB {
    constructor()
    {
        this.apikey = fs.readFileSync('apikey.txt', 'utf8');
        this.client = createClient('https://yshzrbmwnmyhhbldbvqg.supabase.co', this.apikey);
    }
}

function addshards()
{
    var randomnumberbettween0and2 = Math.floor(Math.random() * 3);
    var list1 = [5008, 5005, 5007];
    var list2 = [5008, 5002, 5003];
    var list3 = [5001, 5002, 5003];
    let shard1 = list1[randomnumberbettween0and2];
    let shard2 = list2[randomnumberbettween0and2];
    let shard3 = list3[randomnumberbettween0and2];
    return [shard1, shard2, shard3];
}

async function champandrune(data, lcu)
{
    const resp = await authenticate.createHttp1Request({
        method: 'GET',
        url: '/lol-champ-select/v1/session'
    }, lcu.credentials)
    let assignedPosition = "ARAM";
    resp.raw.myTeam.forEach(champ => {
        if (champ.championId == data)
            assignedPosition = champ.position;
    });
    if (assignedPosition == "" || assignedPosition == "undefined")
        assignedPosition = "ARAM";
    let rune = await authenticate.createHttp1Request({
        method: 'GET',
        url: '/lol-perks/v1/currentpage'
    }, lcu.credentials)
    rune.name = "PJD " + data;
    let database_rune = await dataBase.client.from('runes').select('*').eq('champion_id', data, 'lane', assignedPosition);
    if (database_rune.data.length == 0)
        rune.name = "Not Found";
    else
    {
        let shards = addshards();
        rune.raw.primaryStyleId = database_rune.data[0].primarystyleid;
        rune.raw.subStyleId = database_rune.data[0].substyleid;
        rune.raw.selectedPerkIds = [database_rune.data[0].primary1, database_rune.data[0].primary2, database_rune.data[0].primary3, database_rune.data[0].primary4, database_rune.data[0].sub1, database_rune.data[0].sub2, shards[0], shards[1], shards[2]];
    }
    let newrune = {};
    newrune.name = rune.name;
    newrune.primaryStyleId = rune.raw.primaryStyleId;
    newrune.subStyleId = rune.raw.subStyleId;
    newrune.selectedPerkIds = rune.raw.selectedPerkIds;
    newrune.current = true;
    try
    {
        await authenticate.createHttp1Request({
            method: 'DELETE',
            url: '/lol-perks/v1/pages'
        }, lcu.credentials)
    }
    catch (err)
    {
    }
    await authenticate.createHttp1Request({
        method: 'POST',
        url: '/lol-perks/v1/pages',
        body: newrune
    }, lcu.credentials);
}

async function send_runes(gameId)
{
    console.log("Game ID: " + gameId);
    this.gameId = gameId;
    all = await dataBase.client.from('games').select('*')
    gamess = await dataBase.client.from('games').select('*').eq('gameid', gameId);
    if (gamess.data.length == 0)
    {
        const resp = await dataBase.client.from('games').insert([{
            gameid: gameId,
        }]);
        console.log(resp);
    }
}

class LCU {
    constructor() {
        this.client = "null";
        this.credentials = "null";
        this.session = "idle";
    }

    async login() {
        const credentials = await authenticate.authenticate();
        const client = new authenticate.LeagueClient(credentials, { pollInterval: 1000 });
        this.client = client;
        this.credentials = credentials;
    }
    async sessionws() {
        const ws = await authenticate.createWebSocketConnection(this.credentials);
        ws.subscribe('/lol-gameflow/v1/session', (data) => {
            if (data.phase != this.session) {
                this.session = data.phase;
                console.log(data.phase);
            }
            if(data.phase == "InProgress")
            {
                if(this.gameId != data.gameData.gameId)
                {
                    send_runes(data.gameData.gameId);
                    this.gameId = data.gameData.gameId;
                }
            }
        });
        const ws2 = await authenticate.createWebSocketConnection(this.credentials);
        ws2.subscribe('/lol-champ-select/v1/current-champion', (data) => {
            if (data != 0) {
                champandrune(data, this);
            }
        });
    }
}
lcu = new LCU();
lcu.login();
var dataBase = new DB();
lcu.sessionws();


/*
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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function makerunesfromgame() {
    gameids = await getgameidsfromdatabase();
    for (var i = 0; i < gameids.length; i++) {
        await sleep(1000);
        const matchid = "EUW1_" + gameids[i].gameid;
        axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchid}`, {
            headers: {
                'X-Riot-Token': 'RGAPI-e938c661-3cba-4f85-aa85-d8af215676aa' // Insert your API key here
            }
        }).then(response => {
            response.data.info.participants.forEach(participant => {
                if (participant.kills + participant.assists > 2 * participant.deaths) {
                    let runee = new rune(participant.championId, assignlane(participant.individualPosition), participant.perks.styles[0].style, participant.perks.styles[0].selections[0].perk, participant.perks.styles[0].selections[1].perk, participant.perks.styles[0].selections[2].perk, participant.perks.styles[0].selections[3].perk, participant.perks.styles[1].style, participant.perks.styles[1].selections[0].perk, participant.perks.styles[1].selections[1].perk, participant.win);
                    runee.send();
                }
            });
            db.query('DELETE FROM games WHERE gameid = $1', [gameids[i].gameid])
                .catch(err => console.log(err));
        }).catch(err => console.log("stats still not ready for " + matchid));
    }
}

app.post('/runes/gameid', async (req, res) => {
    db.query('SELECT * FROM games WHERE gameid = $1', [req.body.gameid])
        .then(pgres => {
            if (pgres.length == 0) {
                db.query('INSERT INTO games (gameid) VALUES ($1)', [req.body.gameid])
                    .catch(err => console.log(err));
                res.send("Added");
            }
            else {
                res.send("Already in database");
            }
        })
        .catch(err => console.log(err));
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

makerunesfromgame();
*/