export interface CountdownInfo {
    countdownActive: boolean;
    timeRemaining: number;
    timeUnit: TimeUnit;
}
export type CountdownInterval = NodeJS.Timeout | undefined;

export type TimeUnit = 'd' | 'h' | 'm' | 's';
export function isTimeUnit(unit: any): unit is TimeUnit {
    return ['d', 'h', 'm', 's'].includes(unit);
}
export interface CountdownQuery {
    timeAmount: number;
    timeUnit: TimeUnit;
}
