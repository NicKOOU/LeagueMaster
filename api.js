const { default: axios } = require('axios');
const { createClient } = require('@supabase/supabase-js');
var fs = require('fs');
const authenticate = require('league-connect');
const runesjson = require('./runes.json');
axios.baseURL = "https://yshzrbmwnmyhhbldbvqg.supabase.co";
axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.apikey;

class DB {
    constructor()
    {
        this.apikey = fs.readFileSync('apikey.txt', 'utf8');
        this.client = createClient('https://yshzrbmwnmyhhbldbvqg.supabase.co', this.apikey);
    }
}

class Rune {
    constructor()
    {
        this.primarystyleid = 0;
        this.substyleid = 0;
        this.selectedPerkIds = [];
        this.name = "";
        this.current = true;
    }
}

async function showAllRunesInConsoleToChoose(champion_id, assignedPosition)
{
    let database_rune = await dataBase.client.from('runes').select('*').eq('champion_id', champion_id).eq('lane', assignedPosition).order('count', 'desc');
    // display all runes in console to choose with index
    for(let i = 0; i < database_rune.data.length; i++)
    {
        console.log(i + " : " + runesjson.primary[database_rune.data[i].primarystyleid] + " " + runesjson.secondary[database_rune.data[i].substyleid] + " " + runesjson.primary[database_rune.data[i].primary1] + " " + runesjson.primary[database_rune.data[i].primary2] + " " + runesjson.primary[database_rune.data[i].primary3] + " " + runesjson.primary[database_rune.data[i].primary4]);
    }
    let runeIndex = await readline.question('Which runes do you want to use? : ');
    runeIndex = parseInt(runes);
    let newrune = new Rune(rune.name, rune.primaryStyleId, rune.subStyleId, rune.selectedPerkIds);
    send_rune_to_lc(newrune);

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

async function parseDataBaseRune(database_rune, name, index)
{
    let shards = addshards();
    let text = rune._raw.toString();
    rune = JSON.parse(text);
    rune.name = "PJD " + name;
    rune.primaryStyleId = database_rune.data[index].primarystyleid;
    rune.subStyleId = database_rune.data[index].substyleid;
    rune.selectedPerkIds = [database_rune.data[index].primary1, database_rune.data[index].primary2, database_rune.data[index].primary3, database_rune.data[index].primary4, database_rune.data[index].sub1, database_rune.data[index].sub2, shards[0], shards[1], shards[2]];
    return rune;
}


async function champandrune(data, lcu)
{
    const response = await authenticate.createHttp1Request({
        method: 'GET',
        url: '/lol-champ-select/v1/session'
    }, lcu.credentials)
    const text = response._raw.toString();
    const resp = JSON.parse(text);
    let assignedPosition = "ARAM";
    resp.myTeam.forEach(champ => {
        if (champ.championId == data)
            assignedPosition = champ.position;
    });
    if (assignedPosition == "" || assignedPosition == undefined)
        assignedPosition = "ARAM";
    let rune = await authenticate.createHttp1Request({
        method: 'GET',
        url: '/lol-perks/v1/currentpage'
    }, lcu.credentials);
    let database_rune = await dataBase.client.from('runes').select('*').eq('champion_id', data).eq('lane', assignedPosition).order('count', 'desc');
    let stats = [];
    for(let i = 0; i < database_rune.data.length; i++)
    {
        if(database_rune.data[i].count < 10)
            stats.push(0);
        else
            stats.push(database_rune.data[i].count + database_rune.data[i].winrate);
    }
    let max = Math.max(...stats);
    let index = stats.indexOf(max);
    if (database_rune.data.length == 0)
        rune.name = "Not Found";
    else
    {
        rune = await parseDataBaseRune(database_rune, assignedPosition, index);
    }
    let newrune = new Rune(rune.name, rune.primaryStyleId, rune.subStyleId, rune.selectedPerkIds);
    send_rune_to_lc(newrune);
    showAllRunesInConsoleToChoose(data, assignedPosition);
}

async function send_rune_to_lc(rune)
{
    try
    {
        let del = await authenticate.createHttp1Request({
            method: 'DELETE',
            url: '/lol-perks/v1/pages'
        }, lcu.credentials)
    }
    catch (err)
    {

        console.log(err);
    }
    let send = await authenticate.createHttp1Request({
        method: 'POST',
        url: '/lol-perks/v1/pages',
        body: rune
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
        const credentials = await authenticate.authenticate({
            awaitConnection: true,
            pollInterval: 5000,
            windowsShell: 'powershell'
          })
          
        if(credentials.password == null)
        {
            console.log("LCU no");
            return; 
        }
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