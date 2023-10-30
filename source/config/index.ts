/* eslint-disable @typescript-eslint/naming-convention */
import dotenv from 'dotenv';
dotenv.config();

export interface Config {
    BOT_TOKEN: string;
    BOT_ADMIN_ID: number;
}

export default {
    BOT_TOKEN: process.env.BOT_TOKEN as string,
    BOT_ADMIN_ID: process.env.BOT_ADMIN_ID ? +process.env.BOT_ADMIN_ID : -1
} as Config;
