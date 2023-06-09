const express = require('express');
const app = express();
const port = 9000;
const fs = require('fs');

app.use(express.static('public'));

const Sessions = [
    ("none", "session_none.json"),
    ("lobby", "session_lobby.json"),
    ("champselect", "session_champ_select.json")
]

const Gamemodes = [
    ("aram", "game_mode_aram.json"),
    ("sr", "game_mode_sr.json")
]

let session = "none";

app.get('/lol-gameflow/v1/session/}', (req, res) => {
    res.send(fs.readFileSync(Sessions[session][1]));
});

app.get('/lol-champ-select/v1/session', (req, res) => {
    var rand = Math.floor(Math.random() * Object.keys(Gamemodes).length);
    var randGamemodeValue = Gamemodes[Object.keys(colors)[rand][1]];
    res.send(fs.readFileSync(randGamemodeValue));
});





