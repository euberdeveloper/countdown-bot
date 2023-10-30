import logger from 'euberlog';
import {
    CountDownAlreadyActiveError,
    TimeIsNaNError,
    TimeIsNegativeError,
    TimeNotSpecifiedError
} from '../errors/index.js';

export interface CountdownInfo {
    countdownActive: boolean;
    interval: NodeJS.Timeout | undefined;
    timeRemaining: number;
}

export function defaultCountdownInfo(): CountdownInfo {
    return {
        countdownActive: false,
        interval: undefined,
        timeRemaining: 0
    };
}

export function reset(info: CountdownInfo): boolean {
    const wasActive = info.countdownActive;
    clearInterval(info.interval);
    info.countdownActive = false;
    info.interval = undefined;
    info.timeRemaining = 0;
    return wasActive;
}

export function parseTime(time: string): number {
    if (!time) {
        throw new TimeNotSpecifiedError(time);
    }

    const minutes = +time;

    if (Number.isNaN(minutes)) {
        throw new TimeIsNaNError(time);
    }
    if (minutes < 1) {
        throw new TimeIsNegativeError(time);
    }

    return minutes;
}

export function setUp(
    info: CountdownInfo,
    timeText: string,
    onUpdate: () => Promise<void>,
    onEnd: () => Promise<void>
): void {
    if (info.countdownActive) {
        throw new CountDownAlreadyActiveError();
    }

    info.countdownActive = true;
    info.timeRemaining = parseTime(timeText);
    info.interval = setInterval(() => {
        info.timeRemaining--;
        if (info.timeRemaining <= 0) {
            reset(info);
            onEnd().catch(error => logger.error('Error while ending countdown', error));
        } else {
            onUpdate().catch(error => logger.error('Error while updating countdown', error));
        }
    }, 1000);
}
