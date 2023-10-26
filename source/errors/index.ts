export class CountdownBotError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'CountdownBotError';
    }
}

export class CountdownBotInvalidTimeError extends CountdownBotError {
    constructor(public time: string, message = 'Invalid time: ' + time) {
        super(message);
        this.name = 'CountdownBotInvalidTimeError';
    }
}

export class CountdownBotTimeNotSpecifiedError extends CountdownBotInvalidTimeError {
    constructor(public time: string, message = 'Time not specified: ' + time) {
        super(message, time);
        this.name = 'CountdownBotTimeNotSpecifiedError';
    }
}

export class CountdownBotTimeIsNaNError extends CountdownBotInvalidTimeError {
    constructor(public time: string, message = 'Time is not a number: ' + time) {
        super(message, time);
        this.name = 'CountdownBotTimeIsNaNError';
    }
}

export class CountdownBotTimeIsNegativeError extends CountdownBotInvalidTimeError {
    constructor(public time: string, message = 'Time is negative: ' + time) {
        super(message, time);
        this.name = 'CountdownBotTimeIsNaNError';
    }
}