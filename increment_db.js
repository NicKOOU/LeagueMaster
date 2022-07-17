const client = require('./client.js');
const express = require('express');
const bp = require('body-parser');
const util = require("util");
const { default: axios } = require('axios');
const { send } = require('express/lib/response');
var fs = require('fs');
const pgp = require('pg-promise')();
const db = pgp(client.connection);
async function deleteallgames()
{
    let query = `DELETE FROM games`;
    await db.query(query);
}
async function pushgameids(limit)
{
    let gameid = fs.readFileSync('lastgameid.txt', 'utf8');
    for (let i = 0; i < limit; i++)
    {   
        gameid++;
        let query = `INSERT INTO games (gameid) VALUES (${gameid})`;
        await db.query(query);
    }
    fs.writeFileSync('lastgameid.txt', gameid.toString());
}

pushgameids(500);
