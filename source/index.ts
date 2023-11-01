import { Bot, session } from 'grammy';
import { freeStorage } from '@grammyjs/storage-free';
import { run } from '@grammyjs/runner';
import logger from 'euberlog';

import * as countdown from '@/countdown/index.js';
import { addCommand, setCommandsHelp } from '@/commands/index.js';
import { initialCountdownSessionData, initialIntervalSessionData } from '@/session/index.js';

import { botAdmin } from '@/middlewares/botAdmin.js';
import { errorHandler } from '@/middlewares/errorCatcher.js';
import { runnerSequentialize } from '@/middlewares/sequentialize.js';

import { CountDownAlreadyActiveError, InvalidTimeFormatError, TimeNotSpecifiedError } from '@/errors/index.js';

import type { CountDownContext } from '@/types/index.js';

import config from '@/config/index.js';

async function main() {
    logger.info('Setting bot up');

    logger.debug('Creating bot');
    const bot = new Bot<CountDownContext>(config.BOT_TOKEN);

    logger.debug('Adding middlewares');
    bot.use(runnerSequentialize());
    bot.use(botAdmin(config.BOT_ADMIN_ID));

    logger.debug('Initializing session');
    bot.use(
        session({
            type: 'multi',
            countdown: { initial: initialCountdownSessionData, storage: freeStorage(config.BOT_TOKEN) },
            interval: { initial: initialIntervalSessionData }
        })
    );

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
                const session = await ctx.session;
                if (session.countdown.countdownActive) {
                    throw new CountDownAlreadyActiveError();
                }

                const setupResult = countdown.setUp(
                    timeText,
                    async () => {
                        await ctx.reply(`${session.countdown.timeRemaining} remaining`);
                    },
                    async () => {
                        await ctx.reply('Countdown finished!');
                    }
                );
                session.countdown = setupResult.countdown;
                session.interval = setupResult.interval;
            } catch (error) {
                if (error instanceof TimeNotSpecifiedError) {
                    await ctx.reply('You have to write the counter time after the command (e.g. /countdown 10).');
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
            const session = await ctx.session;
            const wasActive = countdown.reset(session.countdown, session.interval);
            await (!wasActive ? ctx.reply('There is no countdown active') : ctx.reply('Countdown stopped!'));
        }
    });
    await setCommandsHelp(bot);

    bot.catch(errorHandler);
    logger.debug('Starting bot up');

    const runner = run(bot);

    const stopRunner = async () => {
        runner.isRunning() && (await runner.stop());
    };
    process.once('SIGINT', () => {
        stopRunner().catch(error => logger.error('Error while stopping bot', error));
    });
    process.once('SIGTERM', () => {
        stopRunner().catch(error => logger.error('Error while stopping bot', error));
    });

    await bot.init();
    logger.success('Bot started', bot.botInfo);

    await runner.task();
    logger.success('Bot finished gracefully');
}
void main();
