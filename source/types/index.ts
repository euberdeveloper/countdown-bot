import { Context, SessionFlavor } from "grammy";

export interface SessionData {
    countdownActive: boolean;
    intervalId: NodeJS.Timeout | null;
    timeRemaining: number;
}

export type CountDownContext = Context & SessionFlavor<SessionData>;