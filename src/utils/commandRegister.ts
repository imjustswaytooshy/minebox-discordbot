/*
 * Miboxi, New-Gen Discord Bot
 * Copyright (c) 2024 Prism
 * SPDX-License-Identifier: MIT
 */

import { REST } from "@discordjs/rest";
import type { Command } from "@interfaces/Command";
import { ExtendedClient } from "@structures/ExtendedClient";
import logger from "@utils/logger";
import { SlashCommandBuilder } from "discord.js";
import { Routes } from "discord-api-types/v9";
import { readdirSync } from "fs";
import { extname, join } from "path";

const getAllCommandFiles = (dir: string, files: string[] = []): string[] => {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            getAllCommandFiles(fullPath, files);
        } else if (
            entry.isFile() &&
            (extname(entry.name) === ".ts" || extname(entry.name) === ".js")
        ) {
            files.push(fullPath);
        }
    }

    return files;
};

export const registerCommands = async (
    clientId: string,
    token: string,
    client: ExtendedClient
): Promise<void> => {
    const commands: SlashCommandBuilder[] = [];
    const commandsPath = join(__dirname, "../commands");
    const commandFiles = getAllCommandFiles(commandsPath);

    for (const filePath of commandFiles) {
        try {
            const commandModule = await import(filePath);
            const command: Command = commandModule.default;

            if (!command || !command.data) {
                logger.warn(
                    `Command at ${filePath} is missing a valid 'data' property.`
                );
                continue;
            }

            commands.push(command.data);
            client.commands.set(command.data.name, command);
            logger.info(`Loaded command: ${command.data.name}`);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(
                    `Failed to load command from ${filePath}: ${error.message}`
                );
            } else {
                logger.error(`Failed to load command from ${filePath}:`, {
                    error,
                });
            }
        }
    }

    const rest = new REST({ version: "10" }).setToken(token);

    try {
        await rest.put(Routes.applicationCommands(clientId), {
            body: commands,
        });
        logger.info("Successfully registered global application commands.");
    } catch (error) {
        if (error instanceof Error) {
            logger.error("Failed to register application commands:", {
                message: error.message,
            });
        } else {
            logger.error("Failed to register application commands:", { error });
        }
    }
};
