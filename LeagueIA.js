const axios = require('axios');
const { get } = require('http');
(async function () {
    const base = await plouf();
    const perso = await getInfo("garen");
    perso.result.pageContext.runeStyleIds.forEach(element => {
        //console.log(element);
        base.forEach(element2 => {
            if (element2.id === element) {
                console.log(element2.key);
            }
        });
    });
})();

async function getInfo(championname) {
    return axios({
        proxy: false,
        method: 'get',
        url: "https://www.runes-fr.com/page-data/" + championname + "/page-data.json",
        responseType: 'json'

    }).then(response =>
        response.data
    ).catch(error => {
        console.log(error);
    });
}
async function plouf() {
    const runes = await axios({
        proxy: false,
        method: 'get',
        url: "http://ddragon.leagueoflegends.com/cdn/10.16.1/data/en_US/runesReforged.json",
        responseType: 'json'
    }).then(response => response.data)
        .catch(error => {
            console.log(error);
        });
    return runes;
}