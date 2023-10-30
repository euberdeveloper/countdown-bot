import { defaultCountdownInfo } from '../countdown/index.js';
import { SessionData } from '../types/index.js';

export const initialSessionData: () => SessionData = () => ({
    countdown: defaultCountdownInfo()
});
