const express = require("express");
const axios = require("axios");
const authenticate = require("league-connect");
const WebSocket = require("ws");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
const clients = [];
const cors = require('cors');

const app = express();
app.use(cors());
const server = app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

const wss = new WebSocket.Server({ server });


axios.defaults.baseURL = "https://yshzrbmwnmyhhbldbvqg.supabase.co";
axios.defaults.headers.common.Authorization = "Bearer YOUR_SUPABASE_API_KEY";

class DB {
    constructor() {
        this.apikey = fs.readFileSync("apikey.txt", "utf8");
        this.client = createClient(
            "https://yshzrbmwnmyhhbldbvqg.supabase.co",
            this.apikey
        );
    }
}

class Rune {
    constructor(primaryStyleId, subStyleId, selectedPerkIds, name) {
        this.primaryStyleId = primaryStyleId;
        this.subStyleId = subStyleId;
        this.selectedPerkIds = selectedPerkIds;
        this.name = name;
        this.current = true;
    }
}

class LCU {
    constructor() {
        this.client = "null";
        this.credentials = "null";
        this.session = "idle";
        this.gameId = "0";
        this.wsClients = new Set();
    }

    sendToAllClients(data) {
        this.wsClients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
}

const lcu = new LCU();
const dataBase = new DB();

function addshards() {
    const randomnumberbettween0and2 = Math.floor(Math.random() * 3);
    const list1 = [5008, 5005, 5007];
    const list2 = [5008, 5002, 5003];
    const list3 = [5001, 5002, 5003];
    const shard1 = list1[randomnumberbettween0and2];
    const shard2 = list2[randomnumberbettween0and2];
    const shard3 = list3[randomnumberbettween0and2];
    return [shard1, shard2, shard3];
}

async function parseDataBaseRune(databaseRune, name, index, runes) {
    const shards = addshards();
    runes.name = "PJD " + name;
    runes.primaryStyleId = databaseRune.data[index].primarystyleid;
    runes.subStyleId = databaseRune.data[index].substyleid;
    runes.selectedPerkIds = [
        databaseRune.data[index].primary1,
        databaseRune.data[index].primary2,
        databaseRune.data[index].primary3,
        databaseRune.data[index].primary4,
        databaseRune.data[index].sub1,
        databaseRune.data[index].sub2,
        shards[0],
        shards[1],
        shards[2],
    ];
    return runes;
}

async function champandrune(data, lcu) {
    const response = await authenticate.createHttp1Request(
        {
            method: "GET",
            url: "/lol-champ-select/v1/session",
        },
        lcu.credentials
    );
    const text = response._raw.toString();
    const resp = JSON.parse(text);
    let assignedPosition = "ARAM";
    resp.myTeam.forEach((champ) => {
        if (champ.championId === data) {
            assignedPosition = champ.position;
        }
    });
    if (assignedPosition === "" || assignedPosition === undefined) {
        assignedPosition = "ARAM";
    }
    let rune = await authenticate.createHttp1Request(
        {
            method: "GET",
            url: "/lol-perks/v1/currentpage",
        },
        lcu.credentials
    );
    const databaseRune = await dataBase.client
        .from("runes")
        .select("*")
        .eq("champion_id", data)
        .eq("lane", assignedPosition)
        .order("count", "desc");
    const stats = [];
    for (let i = 0; i < databaseRune.data.length; i++) {
        if (databaseRune.data[i].count < 10) {
            stats.push(0);
        } else {
            stats.push(databaseRune.data[i].count + databaseRune.data[i].winrate);
        }
    }
    const max = Math.max(...stats);
    const index = stats.indexOf(max);
    if (databaseRune.data.length === 0) {
        rune.name = "Not Found";
    } else {
        const text = rune._raw.toString();
        rune = JSON.parse(text);
        rune = await parseDataBaseRune(databaseRune, data, index, rune);
    }
    const newrune = new Rune(
        rune.primaryStyleId,
        rune.subStyleId,
        rune.selectedPerkIds,
        rune.name
    );

    await sendRuneToLc(newrune);

}

async function sendRuneToLc(rune) {
    try {
      await authenticate.createHttp1Request(
        {
          method: "DELETE",
          url: "/lol-perks/v1/pages",
        },
        lcu.credentials
      );
    } catch (err) {
      console.log(err);
    }
    await authenticate.createHttp1Request(
      {
        method: "POST",
        url: "/lol-perks/v1/pages",
        body: rune,
      },
      lcu.credentials
    );
  
    const runeMessage = JSON.stringify(rune);
  
    broadcastMessage(runeMessage);
  }
  
  function broadcastMessage(message) {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  

async function sendRunes(gameId) {
    console.log("Game ID: " + gameId);
    lcu.gameId = gameId;
    const gamess = await dataBase.client
        .from("games")
        .select("*")
        .eq("gameid", gameId);
    if (gamess.data.length === 0) {
        await dataBase.client.from("games").insert([
            {
                gameid: gameId,
            },
        ]);
    }
}

async function createLCUWebSocket() {
    const ws = await authenticate.createWebSocketConnection(lcu.credentials);

    ws.subscribe("/lol-gameflow/v1/session", (data) => {
        if (data.phase !== lcu.session) {
            lcu.session = data.phase;
            console.log("Session: " + data.phase);
            const sessionJson = JSON.parse(`{"Session": "${data.phase}"}`);
            broadcastMessage(JSON.stringify(sessionJson))
        }
        if (data.phase === "InProgress") {
            if (lcu.gameId !== data.gameData.gameId) {
                sendRunes(data.gameData.gameId);
                lcu.gameId = data.gameData.gameId;
            }
        }
    });

    ws.subscribe("/lol-champ-select/v1/current-champion", (data) => {
        if (data !== 0) {
            champandrune(data, lcu);
        }
    });


    ws.on("connection", (client) => {
        // if not present, add client to list of clients
        if (!lcu.wsclients.includes(client)) {
            lcu.wsClients.add(client);
        }
    });

    wss.on("connection", (ws) => {
        if(!clients.includes(ws))
            clients.push(ws);
        console.log("New client connected");    
        ws.on("message", (message) => {
          console.log("Received message:", message);
        });
      
        ws.on("close", () => {
          const index = clients.indexOf(ws);
          if (index !== -1) {
            clients.splice(index, 1);
          }
        });
      });

}

async function createFrontConnection()
{

}

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
    });
});

app.get("/api/login", async (req, res) => {
    try {
        const credentials = await authenticate.authenticate({
            awaitConnection: true,
        });

        if (credentials.password === null) {
            res.status(500).json({ error: "LCU login failed" });
        } else {
            const client = new authenticate.LeagueClient(credentials, {});
            lcu.client = client;
            lcu.credentials = credentials;
            lcu.session = "idle";
            createLCUWebSocket();
            res.status(200).json({ message: "LCU login successful" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "LCU login failed" });
    }
});

app.get("/api/current-summoner", async (req, res) => {
    try {
        const response = await authenticate.createHttp1Request(
            {
                method: "GET",
                url: "/lol-summoner/v1/current-summoner",
            },
            lcu.credentials
        );
        response.data = JSON.parse(response._raw.toString());
        response.data.rerollPoints.numberOfRolls = 2;
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get current summoner data" });
    }
});