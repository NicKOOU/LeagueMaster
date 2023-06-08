/* eslint-disable require-jsdoc */
const fs = require('fs');
const {createClient} = require('@supabase/supabase-js');

class DB {
  constructor() {
    this.apikey = fs.readFileSync('apikey.txt', 'utf8');
    this.client = createClient('https://yshzrbmwnmyhhbldbvqg.supabase.co', this.apikey);
  }
}
/* async function deleteallgames() {
  const db = new DB();
  await db.client.from('games')
      .delete();
}*/
async function pushgameids(limit) {
  let gameid = fs.readFileSync('lastgameid.txt', 'utf8');
  for (let i = 0; i < limit; i++) {
    gameid++;
    const db = new DB();
    await db.client.from('games')
        .insert([{gameid: gameid}]);
  }
  fs.writeFileSync('lastgameid.txt', gameid.toString());
}

pushgameids(500);
