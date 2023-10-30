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

export class InvalidTimeFormatError extends InvalidTimeError {
    constructor(
        public time: string,
        message = 'Time has invalid format: ' + time
    ) {
        super(message, time);
        this.name = 'InvalidTimeFormatError';
    }
}

export class InvalidTimeUnitError extends InvalidTimeFormatError {
    constructor(
        public time: string,
        public unit: string,
        message = 'Time has invalid time unit: ' + unit
    ) {
        super(message, time);
        this.name = 'InvalidTimeUnitError';
    }
}

export class CountDownAlreadyActiveError extends CountdownBotError {
    constructor(message = 'Countdown already active') {
        super(message);
        this.name = 'CountDownAlreadyActiveError';
    }
}
