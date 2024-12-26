/*
 * Miboxi, New-Gen Discord Bot
 * Copyright (c) 2024 Prism
 * SPDX-License-Identifier: MIT
 */

import logger from "@utils/logger";
import { Events } from "discord.js";

export default {
    name: Events.ShardResume,
    once: false,
    execute: (shardId: number, replayedEvents: number) => {
        logger.info(
            `Shard ${shardId} has resumed. Replayed ${replayedEvents} events.`
        );
    },
};
