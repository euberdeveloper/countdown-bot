import { Bot, session } from 'grammy';
import logger from 'euberlog';

import { addCommand, setCommandsHelp } from './commands/index.js';
import { initialSessionData, resetSession } from './session/index.js';
import { parseTime } from './countdown/index.js';
import { CountdownBotTimeIsNaNError, CountdownBotTimeIsNegativeError, CountdownBotTimeNotSpecifiedError } from './errors/index.js';
import type { CountDownContext } from './types/index.js';

import config from './config/index.js';

async function main() {
    logger.info('Setting bot up');

    logger.debug('Creating bot');
    const bot = new Bot<CountDownContext>(config.BOT_TOKEN);

    logger.debug('Initializing session');

    bot.use(session({ initial: initialSessionData }));

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
            try {
                const minutes = parseTime(ctx.match);

                if (ctx.session.countdownActive) {
                    await ctx.reply('There is already a countdown active');
                    return;
                }

                ctx.session.countdownActive = true;
                ctx.session.timeRemaining = minutes;
                ctx.session.interval = setInterval(async () => {
                    ctx.session.timeRemaining--;
                    if (ctx.session.timeRemaining <= 0) {
                        resetSession(ctx.session);
                        await ctx.reply('Countdown finished!');
                    }
                    else {
                        await ctx.reply(`${ctx.session.timeRemaining} minutes`);
                    }
                }, 1000);

                
            }
            catch (error) {
                if (error instanceof CountdownBotTimeNotSpecifiedError) {
                    await ctx.reply('You have to write the number of minutes after the command (e.g. /countdown 10).');
                    return;
                }
                else if (error instanceof CountdownBotTimeIsNaNError) {
                    await ctx.reply('The number of minutes must be a number.');
                    return;
                }
                else if (error instanceof CountdownBotTimeIsNegativeError) {
                    await ctx.reply('The number of minutes must be greater than 0.');
                    return;
                }
                else {
                    await ctx.reply('An error ocurred.');
                    logger.error(ctx.message.text, error);
                    return;
                }
            }
        }
    });
    addCommand(bot, {
        command: 'stop',
        description: 'Stops the countdown',
        handler: async ctx => {
            const wasActive = resetSession(ctx.session);
            if (!wasActive) {
                await ctx.reply('There is no countdown active');
            }
            else {
                await ctx.reply('Countdown stopped!');
            }
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
