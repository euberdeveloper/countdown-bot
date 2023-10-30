/* eslint-disable @typescript-eslint/naming-convention */
import dotenv from 'dotenv';
dotenv.config();

export default {
    BOT_TOKEN: process.env.BOT_TOKEN,
    BOT_ADMIN_ID: process.env.BOT_ADMIN_ID ? +process.env.BOT_ADMIN_ID : -1
};
