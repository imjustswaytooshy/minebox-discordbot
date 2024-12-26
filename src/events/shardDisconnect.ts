/*
 * Miboxi, New-Gen Discord Bot
 * Copyright (c) 2024 Prism
 * SPDX-License-Identifier: MIT
 */

import logger from "@utils/logger";
import { type CloseEvent, Events } from "discord.js";

export default {
    name: Events.ShardDisconnect,
    once: false,
    execute: (event: CloseEvent, shardId: number) => {
        logger.warn(`Shard ${shardId} disconnected. Event: ${event}`);
    },
};
