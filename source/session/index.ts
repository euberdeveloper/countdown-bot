import { SessionData } from "types/index.js"

export const initialSessionData = () =>
    ({
        countdownActive: false,
        interval: null,
        timeRemaining: 0
    }) as SessionData;

export function resetSession(sessionData: SessionData): boolean {
    const wasActive = sessionData.countdownActive;
    clearInterval(sessionData.interval);
    sessionData.countdownActive = false;
    sessionData.interval = null;
    sessionData.timeRemaining = 0;
    return wasActive;
}