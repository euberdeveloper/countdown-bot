import config from './config/index.js';
import { Bot } from 'grammy';

async function main() {
    const bot = new Bot(config.BOT_TOKEN);
   
    bot.command('start', ctx => ctx.reply('Welcome!'));
    bot.command('help', ctx => ctx.reply('Help message'));
    
    bot.start({
        onStart() {
            console.log("Bot started!");
        }
    });
}
main();
