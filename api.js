const { default: axios } = require("axios");
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const authenticate = require("league-connect");
const runesjson = require("./runes.json");
const readline = require("readline");

let rl = null;

axios.baseURL = "https://yshzrbmwnmyhhbldbvqg.supabase.co";
axios.defaults.headers.common.Authorization = "Bearer " + this.apikey;

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

class test {
  constructor(Keyone, yonamE) {
    this.Keyone = Keyone;
    this.yonamE = yonamE;
  }
}

async function showAllRunesInConsoleToChoose(
  championId,
  assignedPosition,
  rune
) {
  const databaseRune = await dataBase.client
    .from("runes")
    .select("*")
    .eq("champion_id", championId)
    .eq("lane", assignedPosition)
    .order("count", "desc");
  for (let i = 0; i < databaseRune.data.length; i++) {
    console.log(
      i +
        " : " +
        runesjson.primary[databaseRune.data[i].primarystyleid] +
        " | " +
        runesjson.secondary[databaseRune.data[i].primary1] +
        " | " +
        runesjson.secondary[databaseRune.data[i].primary2] +
        " | " +
        runesjson.secondary[databaseRune.data[i].primary3] +
        " | " +
        runesjson.secondary[databaseRune.data[i].primary4] +
        " | " +
        runesjson.primary[databaseRune.data[i].substyleid] +
        " | " +
        runesjson.secondary[databaseRune.data[i].sub1] +
        " | " +
        runesjson.secondary[databaseRune.data[i].sub2]
    );
  }
  const runeIndexPromise = new Promise((resolve, reject) => {
    rl.question("Which rune do you want to use? ", (answer) => {
      resolve(answer);
    });
  });
  const timeout = new Promise((resolve) => setTimeout(resolve, 30000));
  let runeIndex;

  await Promise.race([runeIndexPromise, timeout])
    .then(async (answer) => {
      if (typeof answer === "string") {
        runeIndex = parseInt(answer);
        const runes = await parseDataBaseRune(
          databaseRune,
          championId,
          runeIndex,
          rune
        );
        const newrune = new Rune(
          runes.primaryStyleId,
          runes.subStyleId,
          runes.selectedPerkIds,
          runes.name
        );
        newrune.name = runes.name + " Mod";
        sendRuneToLc(newrune);
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

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
  sendRuneToLc(newrune);
  showAllRunesInConsoleToChoose(data, assignedPosition, rune);
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
}

async function sendRunes(gameId) {
  console.log("Game ID: " + gameId);
  this.gameId = gameId;
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
      windowsShell: "powershell",
    });

    if (credentials.password === null) {
      console.log("LCU no");
      return;
    }
    const client = new authenticate.LeagueClient(credentials, {
      pollInterval: 1000,
    });
    this.client = client;
    this.credentials = credentials;
  }

  async sessionws() {
    const ws = await authenticate.createWebSocketConnection(this.credentials);
    ws.subscribe("/lol-gameflow/v1/session", (data) => {
      if (data.phase !== this.session) {
        this.session = data.phase;
      }
      if (data.phase === "InProgress") {
        if (this.gameId !== data.gameData.gameId) {
          sendRunes(data.gameData.gameId);
          this.gameId = data.gameData.gameId;
        }
      }
    });
    const ws2 = await authenticate.createWebSocketConnection(this.credentials);
    ws2.subscribe("/lol-champ-select/v1/current-champion", (data) => {
      if (data !== 0) {
        console.clear();
        if (rl !== null) {
          rl.close();
        }
        rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        champandrune(data, this);
        // clearTerminal
      }
    });
  }
}

const lcu = new LCU();
lcu.login();
const dataBase = new DB();
lcu.sessionws();
