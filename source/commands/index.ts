import { Bot } from "grammy";
import logger from "euberlog";

import { EuberBotCommand } from "./types.js";
import { getCommandsHelp } from "./utils.js";

const commands: EuberBotCommand[] = [];

export function addCommand(bot: Bot, command: EuberBotCommand) {
    logger.debug('Adding command', command.command);
    commands.push(command);
    bot.command(command.command, command.handler);
}

export async function setCommandsHelp(bot: Bot) {
    logger.debug('Adding helps');
    const commandsHelp = getCommandsHelp(commands);
    logger.debug('Helps are', commandsHelp);
    return await bot.api.setMyCommands(commandsHelp);
}