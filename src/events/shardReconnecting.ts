/*
 * Miboxi, New-Gen Discord Bot
 * Copyright (c) 2024 Prism
 * SPDX-License-Identifier: MIT
 */

import logger from "@utils/logger";
import { Events } from "discord.js";

export default {
    name: Events.ShardReconnecting,
    once: false,
    execute: (shardId: number) => {
        logger.warn(`Shard ${shardId} is reconnecting...`);
    },
};
