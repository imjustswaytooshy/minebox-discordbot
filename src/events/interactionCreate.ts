/*
 * Miboxi, New-Gen Discord Bot
 * Copyright (c) 2024 Prism
 * SPDX-License-Identifier: MIT
 */

import { ExtendedClient } from "@structures/ExtendedClient";
import logger from "@utils/logger";
import {
    ChatInputCommandInteraction,
    Events,
    type Interaction,
} from "discord.js";

export default {
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction: Interaction): Promise<void> => {
        if (!interaction.isChatInputCommand()) return;

        const command = (interaction.client as ExtendedClient).commands.get(
            interaction.commandName
        );

        if (!command) {
            logger.warn(
                `No command matching ${interaction.commandName} was found.`
            );
            await interaction.reply({
                content: "Command not found.",
                ephemeral: true,
            });
            return;
        }

        try {
            await command.execute(interaction as ChatInputCommandInteraction);
            logger.info(
                `Executed command: ${interaction.commandName} by ${interaction.user.tag}`
            );
        } catch (error) {
            if (error instanceof Error) {
                logger.error(
                    `Error executing command ${interaction.commandName}:`,
                    { message: error.message }
                );
                await interaction.reply({
                    content: "There was an error executing that command.",
                    ephemeral: true,
                });
            } else {
                logger.error(
                    `Unknown error executing command ${interaction.commandName}:`,
                    { error }
                );
                await interaction.reply({
                    content:
                        "There was an unknown error executing that command.",
                    ephemeral: true,
                });
            }
        }
    },
};
