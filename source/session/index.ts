import { defaultCountdownInfo } from '@/countdown/index.js';
import { CountdownInfo } from '@/countdown/types.js';

export interface SessionData {
    countdown: CountdownInfo;
}

export const initialSessionData: () => SessionData = () => ({
    countdown: defaultCountdownInfo()
});
