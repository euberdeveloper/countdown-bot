import { Context, SessionFlavor } from 'grammy';
import { BotAdminFlavor } from '@/middlewares/botAdmin.js';
import { SessionData } from '@/session/index.js';

export type CountDownContext = Context & SessionFlavor<SessionData> & BotAdminFlavor;
