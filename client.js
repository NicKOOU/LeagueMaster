const { Client } = require('pg')
module.exports = {
    connection: {
        host: '',
        user: '',
        password: '',
        database: '',
        port: 5432,
    })
}
module.exports.client.connect();
module.exports.client.query('SELECT * FROM runes', (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log("good");
    }
}
// module.exports.client.connect();