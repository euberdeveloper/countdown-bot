import { Bot } from "grammy";
import { EuberBotCommand } from "./types.js";
import { getCommandsHelp } from "./utils.js";

const commands: EuberBotCommand[] = [];

export function addCommand(bot: Bot, command: EuberBotCommand) {
    commands.push(command);
    bot.command(command.command, command.handler);
}

export async function setCommandsHelp(bot: Bot) {
    const commandsHelp = getCommandsHelp(commands);
    return await bot.api.setMyCommands(commandsHelp);
}