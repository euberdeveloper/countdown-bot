import { CommandMiddleware, Context } from "grammy";
import type { BotCommand } from "grammy/types";

export interface EuberBotCommand extends BotCommand {
    command: string | null;
    handler: CommandMiddleware<Context>;
}