import { addCommand, setCommandsHelp } from './commands/index.js';
import config from './config/index.js';
import { Bot } from 'grammy';

async function main() {
    const bot = new Bot(config.BOT_TOKEN);

    addCommand(bot, {
        command: 'start',
        description: 'Start the bot',
        handler: ctx => ctx.reply('Welcome!')
    });
    addCommand(bot, {
        command: 'help',
        description: 'Show help message',
        handler: ctx => ctx.reply('Help message')
    });
    await setCommandsHelp(bot);
    
    bot.start({
        onStart() {
            console.log("Bot started!");
        }
    });
}
main();
