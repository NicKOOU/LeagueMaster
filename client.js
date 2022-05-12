const { Client } = require('pg')
module.exports = {
    client: new Client({
        host: 'localhost',
        user: 'postgres',
        password: 'nico',
        database: 'runes',
        port: 5432,
    })
}
module.exports.client.connect();
module.exports.client.query('SELECT * FROM runes', (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log(res.rows);
    }
})