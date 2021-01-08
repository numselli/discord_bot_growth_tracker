// website hosting
const fs = require('fs'), express = require('express'), app = express(), config = require('./config.json'), cron = require('node-cron'), fetch = require('node-fetch');
app.use(express.json(), express.static('site'));
app.listen(config.websitePort, () => {
	console.log(`[${(new Date()).toLocaleTimeString("en-us", {year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"})}] site live on 127.0.0.1:${config.websitePort}`);
});
app.get('/', async (req, res) => {
	res.sendFile('./site/index.html', { root: __dirname });
});
app.get('/chartdata', async (req, res) => {
	let rawdata = fs.readFileSync('dataset.json'), data = JSON.parse(rawdata);
	res.json(data);
});


// collect data
(async () => {
	let intrawdata = fs.readFileSync('dataset.json'), intdata = JSON.parse(intrawdata);
	intdata.labels.push((new Date()).toLocaleTimeString("en-us", {year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"})); 
	if (intdata.datasets.length === 0) {
		intdata.datasets =  await Promise.all(
			config.botIDs.map(async(id)=>{
				var botdata = await getbot(id), randomRGB = random_rgba()
				return {"label": `${botdata.bot.username}#${botdata.bot.discriminator}`,"data": [botdata.bot.approximate_guild_count],"backgroundColor": randomRGB,"borderColor": randomRGB,"fill": false,"lineTension": 0, "pointRadius": 5}
			})
		);
		writedatasetfile(intdata)
	}
})();
cron.schedule(config.checkInterval, async() => {
	let rawdata = fs.readFileSync('dataset.json'), data = JSON.parse(rawdata);
	data.labels.push((new Date()).toLocaleTimeString("en-us", {year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"})); 
	await Promise.all(
		config.botIDs.map(async(id)=>{
			var botdata = await getbot(id)
			return ((await data.datasets.map(bot=>{
				if (bot.label===`${botdata.bot.username}#${botdata.bot.discriminator}`){
					bot.data.push(botdata.bot.approximate_guild_count)
					return bot
				}
			})).filter(function( element ) {
				return element !== undefined;
			}))
		})
	);
	writedatasetfile(data)
	console.log(`[${(new Date()).toLocaleTimeString("en-us", {year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"})}] saved`);
});
function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}
async function getbot(id){
	return await fetch(`https://discord.com/api/v8/oauth2/authorize?client_id=${id}&scope=bot`, { method: 'GET', headers: {authorization: config.discordAuthorization}})
	.then(res => res.json())
	.then(json => { return json});
}
function writedatasetfile(data){
	fs.writeFile("dataset.json", JSON.stringify(data), function(err) {
		if (err) {
			console.log(err);
		}
	});
}
