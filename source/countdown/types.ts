export interface CountdownInfo {
    countdownActive: boolean;
    interval: NodeJS.Timeout | undefined;
    timeRemaining: number;
    timeUnit: TimeUnit;
}

export type TimeUnit = 'd' | 'h' | 'm' | 's';
export function isTimeUnit(unit: any): unit is TimeUnit {
    return ['d', 'h', 'm', 's'].includes(unit);
}
export interface CountdownQuery {
    timeAmount: number;
    timeUnit: TimeUnit;
}
