import { Bot } from 'grammy';
import logger from 'euberlog';

import { addCommand, setCommandsHelp } from './commands/index.js';
import config from './config/index.js';

async function main() {
    logger.info('Setting bot up');

    logger.debug('Creating bot');
    const bot = new Bot(config.BOT_TOKEN);

    logger.debug('Setting commands up');
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
    
    logger.debug('Starting bot up');
    bot.start({
        onStart(botInfo) {
            logger.success('Bot started', botInfo);
        }
    });
}
main();
