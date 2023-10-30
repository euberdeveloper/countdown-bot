import { Context, SessionFlavor } from 'grammy';
import { CountdownInfo } from '../countdown/index.js';

export interface SessionData {
    countdown: CountdownInfo;
}

export type CountDownContext = Context & SessionFlavor<SessionData>;
