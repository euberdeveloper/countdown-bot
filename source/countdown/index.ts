import {
    CountDownAlreadyActiveError,
    TimeIsNaNError,
    TimeIsNegativeError,
    TimeNotSpecifiedError
} from '../errors/index.js';

export class CountdownInfo {
    countdownActive: boolean;
    interval: NodeJS.Timeout | null;
    timeRemaining: number;
}

export function defaultCountdownInfo(): CountdownInfo {
    return {
        countdownActive: false,
        interval: null,
        timeRemaining: 0
    };
}

export function reset(info: CountdownInfo): boolean {
    const wasActive = info.countdownActive;
    clearInterval(info.interval);
    info.countdownActive = false;
    info.interval = null;
    info.timeRemaining = 0;
    return wasActive;
}

export function parseTime(time: string) {
    if (!time) {
        throw new TimeNotSpecifiedError(time);
    }

    const minutes = +time;

    if (isNaN(minutes)) {
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
) {
    if (info.countdownActive) {
        throw new CountDownAlreadyActiveError();
    }

    info.countdownActive = true;
    info.timeRemaining = parseTime(timeText);
    info.interval = setInterval(() => {
        info.timeRemaining--;
        if (info.timeRemaining <= 0) {
            reset(info);
            onEnd();
        } else {
            onUpdate();
        }
    }, 1000);
}
