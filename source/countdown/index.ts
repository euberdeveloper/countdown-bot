import { CountdownBotTimeIsNaNError, CountdownBotTimeIsNegativeError, CountdownBotTimeNotSpecifiedError } from "../errors/index.js";


export function parseTime(time: string) {
    if (!time) {
        throw new CountdownBotTimeNotSpecifiedError(time);
    }

    const minutes = +time;

    if (isNaN(minutes)) {
        throw new CountdownBotTimeIsNaNError(time);
    }
    if (minutes < 1) {
        throw new CountdownBotTimeIsNegativeError(time);
    }

    return minutes;
}