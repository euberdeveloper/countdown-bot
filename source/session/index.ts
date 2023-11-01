import { defaultCountdownInfo, defaultCountdownInterval } from '@/countdown/index.js';
import { CountdownInfo, CountdownInterval } from '@/countdown/types.js';

export type CountdownSessionData = CountdownInfo;
export type IntervalSessionData = CountdownInterval;
export interface SessionData {
    countdown: CountdownSessionData;
    interval: IntervalSessionData;
}

export const initialCountdownSessionData: () => CountdownSessionData = defaultCountdownInfo;
export const initialIntervalSessionData: () => IntervalSessionData = defaultCountdownInterval;
