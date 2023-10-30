import { CommandMiddleware } from 'grammy';
import type { BotCommand } from 'grammy/types';

import { CountDownContext } from '../types/index.js';

export interface EuberBotCommand extends BotCommand {
    command: string | null;
    handler: CommandMiddleware<CountDownContext>;
}
