/*
 * Miboxi, New-Gen Discord Bot
 * Copyright (c) 2024 Prism
 * SPDX-License-Identifier: MIT
 */

import type { Command } from "@interfaces/Command";
import { Client, type ClientOptions, Collection } from "discord.js";

export class ExtendedClient extends Client {
    commands: Collection<string, Command> = new Collection();

    constructor(options: ClientOptions) {
        super(options);
    }
}
