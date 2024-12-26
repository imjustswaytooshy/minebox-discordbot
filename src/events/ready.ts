/*
 * Miboxi, New-Gen Discord Bot
 * Copyright (c) 2024 Prism
 * SPDX-License-Identifier: MIT
 */

import { ExtendedClient } from "@structures/ExtendedClient";
import logger from "@utils/logger";
import { ActivityType, Events } from "discord.js";

export default {
    name: Events.ClientReady,
    once: true,
    execute: (client: ExtendedClient) => {
        logger.info(`Logged in as ${client.user?.tag}!`);
        client.user?.setPresence({
            activities: [{ name: "the market", type: ActivityType.Watching }],
            status: "online",
        });
    },
};
