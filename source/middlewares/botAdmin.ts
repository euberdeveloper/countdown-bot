import { Context, Middleware } from 'grammy';

export interface BotAdminFlavor {
    adminId: number;
    isAdmin: boolean;
}

export function botAdmin(adminId: number): Middleware<Context & BotAdminFlavor> {
    return async (ctx, next) => {
        ctx.adminId = adminId;
        ctx.isAdmin = ctx.from?.id === adminId;
        await next();
    };
}
