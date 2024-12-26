/*
 * Miboxi, New-Gen Discord Bot
 * Copyright (c) 2024 Prism
 * SPDX-License-Identifier: MIT
 */

import { type Interaction,SlashCommandBuilder } from "discord.js";

export interface Command {
    data: SlashCommandBuilder;
    execute(interaction: Interaction): Promise<void>;
}
