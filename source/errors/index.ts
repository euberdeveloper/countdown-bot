export class CountdownBotError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'CountdownBotError';
    }
}

export class InvalidTimeError extends CountdownBotError {
    constructor(
        public time: string,
        message = 'Invalid time: ' + time
    ) {
        super(message);
        this.name = 'InvalidTimeError';
    }
}

export class TimeNotSpecifiedError extends InvalidTimeError {
    constructor(
        public time: string,
        message = 'Time not specified: ' + time
    ) {
        super(message, time);
        this.name = 'TimeNotSpecifiedError';
    }
}

export class TimeIsNaNError extends InvalidTimeError {
    constructor(
        public time: string,
        message = 'Time is not a number: ' + time
    ) {
        super(message, time);
        this.name = 'TimeIsNaNError';
    }
}

export class TimeIsNegativeError extends InvalidTimeError {
    constructor(
        public time: string,
        message = 'Time is negative: ' + time
    ) {
        super(message, time);
        this.name = 'TimeIsNegativeError';
    }
}

export class CountDownAlreadyActiveError extends CountdownBotError {
    constructor(message = 'Countdown already active') {
        super(message);
        this.name = 'CountDownAlreadyActiveError';
    }
}
