import { defaultCountdownInfo } from '../countdown/index.js';
import { SessionData } from '../types/index.js';

export const initialSessionData = () =>
    ({
        countdown: defaultCountdownInfo()
    } as SessionData);
