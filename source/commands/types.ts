import { CommandMiddleware } from 'grammy';
import type { BotCommand } from 'grammy/types';

import { CountDownContext } from '../types/index.js';

export interface EuberBotCommand extends BotCommand {
    handler: CommandMiddleware<CountDownContext>;
    hidden?: boolean;
}
