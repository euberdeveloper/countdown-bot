import { Bot } from 'grammy';
import logger from 'euberlog';

import { CountDownContext } from '../types/index.js';
import { EuberBotCommand } from './types.js';
import { getCommandsHelp } from './utils.js';

const commands: EuberBotCommand[] = [];

export function addCommand(bot: Bot<CountDownContext>, command: EuberBotCommand): void {
    logger.debug('Adding command', command.command);
    commands.push(command);
    bot.command(command.command, command.handler);
}

export async function setCommandsHelp(bot: Bot): Promise<boolean> {
    logger.debug('Adding helps');
    const commandsHelp = getCommandsHelp(commands);
    logger.debug('Helps are', commandsHelp);
    return await bot.api.setMyCommands(commandsHelp);
}
