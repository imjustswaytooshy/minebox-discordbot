/*
 * Miboxi, New-Gen Discord Bot
 * Copyright (c) 2024 Prism
 * SPDX-License-Identifier: MIT
 */

import { ExtendedClient } from "@structures/ExtendedClient";
import { registerCommands } from "@utils/commandRegister";
import logger from "@utils/logger";
import { type CloseEvent, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";

config({ path: join(__dirname, "../.env") });

const client = new ExtendedClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
    ],
});

const CLIENT_ID = process.env.CLIENT_ID as string;
const TOKEN = process.env.TOKEN as string;

await registerCommands(CLIENT_ID, TOKEN, client);
logger.info("Global commands registered.");

const eventsPath = join(__dirname, "events");
const eventFiles = readdirSync(eventsPath).filter(
    (file) => file.endsWith(".ts") || file.endsWith(".js")
);

for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    import(filePath)
        .then((event) => {
            if (event.default && event.default.execute) {
                const eventName = event.default.name;
                const eventExecute = event.default.execute;
                const eventOnce = event.default.once;

                if (eventOnce) {
                    client.once(eventName, (...args: unknown[]) =>
                        eventExecute(...args)
                    );
                } else {
                    client.on(eventName, (...args: unknown[]) =>
                        eventExecute(...args)
                    );
                }

                logger.info(`Loaded event handler: ${eventName}`);
            }
        })
        .catch((error) => {
            logger.error(`Failed to load event handler ${file}:`, { error });
        });
}

client.on(Events.ShardReconnecting, (shardId: number) => {
    logger.warn(`Shard ${shardId} is reconnecting...`);
});

client.on(Events.ShardResume, (shardId: number, replayedEvents: number) => {
    logger.info(
        `Shard ${shardId} has resumed. Replayed ${replayedEvents} events.`
    );
});

client.on(Events.ShardDisconnect, (event: CloseEvent, shardId: number) => {
    logger.warn(`Shard ${shardId} disconnected. Event: ${event}`);
});

(async () => {
    try {
        await client.login(TOKEN);
        logger.info("Bot successfully logged in.");
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Failed to log in the bot: ${error.message}`);
        } else {
            logger.error(`Failed to log in the bot:`, { error });
        }
        // future notify
    }
})();

process.on(
    "unhandledRejection",
    (reason: unknown, promise: Promise<unknown>) => {
        logger.error(`Unhandled Rejection at: ${promise}`, { reason });
    }
);

process.on("uncaughtException", (error: Error) => {
    logger.fatal(`Uncaught Exception thrown: ${error.message}`, { error });
});
