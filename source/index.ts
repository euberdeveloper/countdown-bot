import { Bot, session } from 'grammy';
import logger from 'euberlog';

import { addCommand, setCommandsHelp } from './commands/index.js';
import config from './config/index.js';
import { CountDownContext, SessionData } from 'types/index.js';

async function main() {
    logger.info('Setting bot up');

    logger.debug('Creating bot');
    const bot = new Bot<CountDownContext>(config.BOT_TOKEN);

    logger.debug('Initializing session');
    function initial(): SessionData {
        return {
            countdownActive: false,
            intervalId: null,
            timeRemaining: 0
        };
    }
    bot.use(session({ initial }));

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
    addCommand(bot, {
        command: 'countdown',
        description: 'Starts a countdown',
        handler: async ctx => {
            const minutesText = ctx.match;
            const minutes = +minutesText;

            if (isNaN(minutes)) {
                await ctx.reply('You have to write the number of minutes after the command.');
                return;
            }

            if (minutes < 1) {
                await ctx.reply('The number of minutes must be greater than 0');
                return;
            }

            if (ctx.session.countdownActive) {
                await ctx.reply('There is already a countdown active');
                return;
            }

            ctx.session.countdownActive = true;
            ctx.session.timeRemaining = minutes;
            ctx.session.intervalId = setInterval(async () => {
                ctx.session.timeRemaining--;
                if (ctx.session.timeRemaining <= 0) {
                    clearInterval(ctx.session.intervalId);
                    ctx.session.countdownActive = false;
                    ctx.session.intervalId = null;
                    await ctx.reply('Countdown finished!');
                }
                else {
                    await ctx.reply(`${ctx.session.timeRemaining} minutes`);
                }
            }, 1000);
        }
    });
    addCommand(bot, {
        command: 'stop',
        description: 'Stops the countdown',
        handler: async ctx => {
            if (!ctx.session.countdownActive) {
                await ctx.reply('There is no countdown active');
                return;
            }

            clearInterval(ctx.session.intervalId);
            ctx.session.countdownActive = false;
            ctx.session.intervalId = null;
            await ctx.reply('Countdown stopped!');
        }
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
