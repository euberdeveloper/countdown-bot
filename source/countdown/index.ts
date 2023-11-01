import logger from 'euberlog';
import { InvalidTimeFormatError, InvalidTimeUnitError, TimeNotSpecifiedError } from '@/errors/index.js';
import { CountdownInfo, CountdownInterval, CountdownQuery, isTimeUnit, TimeUnit } from './types.js';

export function defaultCountdownInfo(): CountdownInfo {
    return {
        countdownActive: false,
        timeRemaining: 0,
        timeUnit: 'm'
    };
}
export function defaultCountdownInterval(): CountdownInterval {
    return undefined;
}

export function reset(info: CountdownInfo, interval: CountdownInterval): boolean {
    const wasActive = info.countdownActive;
    clearInterval(interval);
    info.countdownActive = false;
    interval = undefined;
    info.timeRemaining = 0;
    return wasActive;
}

export function parseTime(time: string): CountdownQuery {
    if (!time) {
        throw new TimeNotSpecifiedError(time);
    }

    const timeRegexp = /^(?<timeAmount>\d+)(?<timeUnit>[dhms])?$/;
    const match = timeRegexp.exec(time);
    if (!match?.groups) {
        throw new InvalidTimeFormatError(time);
    }
    const { timeAmount, timeUnit = 'm' } = match.groups;
    if (!isTimeUnit(timeUnit)) {
        throw new InvalidTimeUnitError(time, timeUnit);
    }

    return {
        timeAmount: +timeAmount,
        timeUnit: timeUnit
    };
}

export function timeUnitToMilliseconds(timeUnit: TimeUnit): number {
    function timeUnitToSeconds(timeUnit: TimeUnit): number {
        switch (timeUnit) {
            case 'd':
                return 24 * 60 * 60;
            case 'h':
                return 60 * 60;
            case 'm':
                return 60;
            case 's':
                return 1;
        }
    }
    return timeUnitToSeconds(timeUnit) * 1000;
}

export function setUp(
    timeText: string,
    onUpdate: () => Promise<void>,
    onEnd: () => Promise<void>
): { countdown: CountdownInfo; interval: CountdownInterval } {
    const countdownQuery = parseTime(timeText);
    const countdown: CountdownInfo = {
        countdownActive: true,
        timeRemaining: countdownQuery.timeAmount,
        timeUnit: countdownQuery.timeUnit
    };
    const interval = setInterval(() => {
        countdown.timeRemaining--;
        if (countdown.timeRemaining <= 0) {
            reset(countdown, interval);
            onEnd().catch(error => logger.error('Error while ending countdown', error));
        } else {
            onUpdate().catch(error => logger.error('Error while updating countdown', error));
        }
    }, timeUnitToMilliseconds(countdownQuery.timeUnit));
    return { countdown, interval };
}
