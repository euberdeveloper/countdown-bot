import { Middleware } from 'grammy';
import { sequentialize } from '@grammyjs/runner';

export function runnerSequentialize(): Middleware {
    return sequentialize(ctx => {
        const chat = ctx.chat?.id.toString();
        const user = ctx.from?.id.toString();
        return [chat, user].filter(con => con === undefined) as string[];
    });
}
