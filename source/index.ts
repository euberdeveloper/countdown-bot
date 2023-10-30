import { Bot, session } from 'grammy';
import logger from 'euberlog';

import { addCommand, setCommandsHelp } from './commands/index.js';
import { initialSessionData } from './session/index.js';
import * as countdown from './countdown/index.js';
import { CountDownAlreadyActiveError, InvalidTimeFormatError, TimeNotSpecifiedError } from './errors/index.js';
import type { CountDownContext } from './types/index.js';

import config from './config/index.js';
import { botAdmin } from './middlewares/botAdmin.js';

async function main() {
    logger.info('Setting bot up');

    logger.debug('Creating bot');
    const bot = new Bot<CountDownContext>(config.BOT_TOKEN);

    logger.debug('Adding middlewares');
    bot.use(botAdmin(config.BOT_ADMIN_ID));

    logger.debug('Initializing session');
    bot.use(session({ initial: initialSessionData }));

    logger.debug('Setting commands up');
    addCommand(bot, {
        command: 'start',
        description: 'Start the bot',
        handler: async ctx => ctx.reply('Welcome!')
    });
    addCommand(bot, {
        command: 'help',
        description: 'Show help message',
        handler: async ctx => ctx.reply('Help message')
    });
    addCommand(bot, {
        command: 'countdown',
        description: 'Starts a countdown',
        handler: async ctx => {
            try {
                const timeText = ctx.match;
                if (ctx.session.countdown.countdownActive) {
                    throw new CountDownAlreadyActiveError();
                }

                ctx.session.countdown = countdown.setUp(
                    timeText,
                    async () => {
                        await ctx.reply(`${ctx.session.countdown.timeRemaining} minutes`);
                    },
                    async () => {
                        await ctx.reply('Countdown finished!');
                    }
                );
            } catch (error) {
                if (error instanceof TimeNotSpecifiedError) {
                    await ctx.reply('You have to write the number of minutes after the command (e.g. /countdown 10).');
                    return;
                } else if (error instanceof InvalidTimeFormatError) {
                    await ctx.reply(
                        'The format of the time is invalid. It has to be a number followed by a unit (e.g. 10m). The units are: d, h, m, s.'
                    );
                    return;
                } else if (error instanceof CountDownAlreadyActiveError) {
                    await ctx.reply('There is already a countdown active');
                    return;
                } else {
                    await ctx.reply('An error ocurred.');
                    logger.error(ctx.message!.text, error);
                    return;
                }
            }
        }
    });
    addCommand(bot, {
        command: 'stop',
        description: 'Stops the countdown',
        handler: async ctx => {
            const wasActive = countdown.reset(ctx.session.countdown);
            await (!wasActive ? ctx.reply('There is no countdown active') : ctx.reply('Countdown stopped!'));
        }
    });
    await setCommandsHelp(bot);

    logger.debug('Starting bot up');
    await bot.start({
        onStart(botInfo) {
            logger.success('Bot started', botInfo);
        }
    });
}
void main();
