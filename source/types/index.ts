import { Context, SessionFlavor } from 'grammy';
import { CountdownInfo } from '@/countdown/types.js';

export interface SessionData {
    countdown: CountdownInfo;
}

export type CountDownContext = Context & SessionFlavor<SessionData>;
