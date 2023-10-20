import { BotCommand } from "grammy/types";
import { EuberBotCommand } from "./types.js";
import { Bot } from "grammy";

export function getCommandsHelp(commands: EuberBotCommand[]): BotCommand[] {
    return commands
        .filter(command => command.description !== null)
        .map<BotCommand>(({ command, description }) => ({ command, description }));
}

export async function setCommands(bot: Bot, commands: EuberBotCommand[]) {
    const commandsHelp = getCommandsHelp(commands);
    await bot.api.setMyCommands(commandsHelp);
}