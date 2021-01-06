# An easy way to visualy veiw the growth of your discord bot.

## How to setup
1. Download [Node.js](https://nodejs.org/en/download/)
2. Download this repo
3. Open cmd or terminal type `cd ` then drag the folder for this repo into the cmd/terminal window and hit enter.
4. type `npm i` and hit enter
5. edit the `config.json` file
    1. checkInterva this is how often the chart will get new information. it is written in the cron format, you can use [this site](https://crontab.guru/) to genarate this<br>defualt: every 24 hours
    2. websitePort this is part of the url used to veiw the chart. this can be any four diget number from `0001` to `9999`. <br> defualt: 6969
    3. discordAuthorization put your discord user token here, its not used for anything but authenticating with discord. I recomend using an alt accout's token for this, since this might be agenst discord's tos.
    4. botIDs this is where you put the id's of the bots that you want to track
6. type `pm2 start index.js --name bot-growth-tracker` and hit enter
7. go to `127.0.0.1:`port-number in your web browser

## todo
- [ ] get server count and name from top.gg and other sources before getting from discord. this is to reduce the possibility of being detected as a self-bot by discord.