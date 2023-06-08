/* eslint-disable require-jsdoc */
const {default: axios} = require('axios');
const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');

class DB {
  constructor() {
    this.apikey = fs.readFileSync('apikey.txt', 'utf8');
    this.client = createClient('https://yshzrbmwnmyhhbldbvqg.supabase.co', this.apikey);
  }
}

class Rune {
  constructor(championId, lane, primarystyleid, primary1,
      primary2, primary3, primary4, substyleid, sub1, sub2, win) {
    this.championId = championId;
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
    if (this.primary1 === 0) {
      return;
    }
    const count = await db.client.from('runes')
        .select('*')
        .eq('champion_id', this.championId)
        .eq('lane', this.lane)
        .eq('primarystyleid', this.primarystyleid)
        .eq('primary1', this.primary1)
        .eq('primary2', this.primary2)
        .eq('primary3', this.primary3)
        .eq('primary4', this.primary4)
        .eq('substyleid', this.substyleid)
        .eq('sub1', this.sub1)
        .eq('sub2', this.sub2)
        .then((pgres) => pgres.data.length)
        .catch((err) => console.log(err));
    if (count > 0) {
      const number = await db.client.from('runes')
          .select('*')
          .eq('champion_id', this.championId)
          .eq('lane', this.lane)
          .eq('primarystyleid', this.primarystyleid)
          .eq('primary1', this.primary1)
          .eq('primary2', this.primary2)
          .eq('primary3', this.primary3)
          .eq('primary4', this.primary4)
          .eq('substyleid', this.substyleid)
          .eq('sub1', this.sub1)
          .eq('sub2', this.sub2)
          .then((pgres) => pgres.data[0].count)
          .catch((err) => console.log(err));

      await db.client.from('runes')
          .update({count: number + 1})
          .eq('champion_id', this.championId)
          .eq('lane', this.lane)
          .eq('primarystyleid', this.primarystyleid)
          .eq('primary1', this.primary1)
          .eq('primary2', this.primary2)
          .eq('primary3', this.primary3)
          .eq('primary4', this.primary4)
          .eq('substyleid', this.substyleid)
          .eq('sub1', this.sub1)
          .eq('sub2', this.sub2);
    } else {
      await db.client.from('runes')
          .insert([{champion_id: this.championId,
            lane: this.lane, primarystyleid:
            this.primarystyleid, primary1: this.primary1,
            primary2: this.primary2, primary3: this.primary3,
            primary4: this.primary4, substyleid: this.substyleid,
            sub1: this.sub1, sub2: this.sub2}]);
    }
    if (this.win === true) {
      const wina = await db.client.from('runes')
          .select('*')
          .eq('champion_id', this.championId)
          .eq('lane', this.lane)
          .eq('primarystyleid', this.primarystyleid)
          .eq('primary1', this.primary1)
          .eq('primary2', this.primary2)
          .eq('primary3', this.primary3)
          .eq('primary4', this.primary4)
          .eq('substyleid', this.substyleid)
          .eq('sub1', this.sub1)
          .eq('sub2', this.sub2)
          .then((pgres) => pgres.data[0].win)
          .catch((err) => console.log(err));
      await db.client.from('runes')
          .update({win: wina + 1})
          .eq('champion_id', this.championId)
          .eq('lane', this.lane)
          .eq('primarystyleid', this.primarystyleid)
          .eq('primary1', this.primary1)
          .eq('primary2', this.primary2)
          .eq('primary3', this.primary3)
          .eq('primary4', this.primary4)
          .eq('substyleid', this.substyleid)
          .eq('sub1', this.sub1)
          .eq('sub2', this.sub2);
    }
    const gameCount = await db.client.from('runes')
        .select('*')
        .eq('champion_id', this.championId)
        .eq('lane', this.lane)
        .eq('primarystyleid', this.primarystyleid)
        .eq('primary1', this.primary1)
        .eq('primary2', this.primary2)
        .eq('primary3', this.primary3)
        .eq('primary4', this.primary4)
        .eq('substyleid', this.substyleid)
        .eq('sub1', this.sub1)
        .eq('sub2', this.sub2)
        .then((pgres) => pgres.data[0].count)
        .catch((err) => console.log(err));
    const win = await db.client.from('runes')
        .select('*')
        .eq('champion_id', this.championId)
        .eq('lane', this.lane)
        .eq('primarystyleid', this.primarystyleid)
        .eq('primary1', this.primary1)
        .eq('primary2', this.primary2)
        .eq('primary3', this.primary3)
        .eq('primary4', this.primary4)
        .eq('substyleid', this.substyleid)
        .eq('sub1', this.sub1)
        .eq('sub2', this.sub2)
        .then((pgres) => pgres.data[0].win)
        .catch((err) => console.log(err));
    const winrate = win / gameCount * 100;
    console.log('winrate: ' + winrate);
    await db.client.from('runes')
        .update({winrate})
        .eq('champion_id', this.championId)
        .eq('lane', this.lane)
        .eq('primarystyleid', this.primarystyleid)
        .eq('primary1', this.primary1)
        .eq('primary2', this.primary2)
        .eq('primary3', this.primary3)
        .eq('primary4', this.primary4)
        .eq('substyleid', this.substyleid)
        .eq('sub1', this.sub1)
        .eq('sub2', this.sub2);
  }
}

function assignlane(ip) {
  if (ip === 'Invalid') {
    return 'ARAM';
  }
  switch (ip) {
    case 'TOP':
      return 'top';
    case 'JUNGLE':
      return 'jungle';
    case 'MIDDLE':
      return 'middle';
    case 'BOTTOM':
      return 'bottom';
    case 'UTILITY':
      return 'utility';
    default:
      return '';
  }
}

async function getgameidsfromdatabase() {
  const gameids = await db.client.from('games')
      .select('*')
      .then((pgres) => pgres)
      .catch((err) => console.log(err));
  return gameids;
}

async function wait(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function makerunesfromgame() {
  let gameids = await getgameidsfromdatabase();
  gameids = gameids.data;
  for (const element of gameids) {
    await wait(500);
    const matchid = 'EUW1_' + element.gameid;
    axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchid}`, {
      headers: {
        'X-Riot-Token': '', // Insert your API key here
      },
    })
        .then((response) => {
          response.data.info.participants.forEach((participant) => {
            if (participant.kills +
              participant.assists > 2 * participant.deaths) {
              const runee = new Rune(participant.championId,
                  assignlane(participant.individualPosition),
                  participant.perks.styles[0].style,
                  participant.perks.styles[0].selections[0].perk,
                  participant.perks.styles[0].selections[1].perk,
                  participant.perks.styles[0].selections[2].perk,
                  participant.perks.styles[0].selections[3].perk,
                  participant.perks.styles[1].style,
                  participant.perks.styles[1].selections[0].perk,
                  participant.perks.styles[1].selections[1].perk,
                  participant.win);
              runee.send();
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    db.client.from('games')
        .delete()
        .eq('gameid', element.gameid)
        .then(() => console.log('deleted'));
  }
}

const db = new DB();
makerunesfromgame();
