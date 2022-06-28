const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.listen(3000, () => {
    console.log('App listen 3000');
})

const { Telegraf } = require("telegraf");
require("dotenv").config();
let bot = new Telegraf('5465064074:AAGeykMj0AAKRwYOByBrhSqMiVPSFpRZtKw');


function getAllUsers() {
    const pathFile = path.join(__dirname, 'peoples.json');
    const data = fs.readFileSync(pathFile);
    return JSON.parse(data.toString());
}

app.post('/send/message', (req, res) => {
    const message = req.body.message;
    const userIds = getAllUsers();

    userIds.users.forEach((value) => {
        bot.telegram.sendMessage(value, message).then();
    })
    res.json('OK');
})

bot.start((ctx) => {
        // const allUsers = getAllUsers();
        // const arr = { users: [...allUsers.users] };
        // if (!arr.users.includes(ctx.from.id)) {
        //     arr.users.push(ctx.from.id);
        // }
        // fs.writeFile(path.join(__dirname, 'peoples.json'), JSON.stringify(arr), ((err) => err && console.log(err)));

        ctx.reply(
            `Доброго дня, ${
                ctx.from.first_name ? ctx.from.first_name : "учасник клубу"
            }!`
        )
    }
);
bot.help((ctx) => ctx.reply("Справка в процессе"));

bot.command("whoami", (ctx) => {
    const { id, username, first_name, last_name } = ctx.from;
     ctx.reply(`Кто ты в телеграмме:
*id* : ${id}
*username* : ${username}
*Имя* : ${first_name}
*Фамилия* : ${last_name}
*chatId* : ${ctx.chat.id}`);
});

bot.launch();
