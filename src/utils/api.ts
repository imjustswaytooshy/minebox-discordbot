/*
 * Miboxi, New-Gen Discord Bot
 * Copyright (c) 2024 Prism
 * SPDX-License-Identifier: MIT
 */

import logger from "@utils/logger";

export interface ApiResponse {
    BUY: {
        stream: null;
        values: [number, string][];
    };
    DIRECT: null;
    SELL: {
        stream: null;
        values: [number, string][];
    };
}

export interface ApiError {
    status: number;
    message: string;
    url: string;
}

const API_BASE_URL = "https://api.minebox.co";

const createApiError = (
    status: number,
    message: string,
    url: string
): ApiError => ({
    status,
    message,
    url,
});

export const fetchMarketData = async (
    itemId: string,
    period: "day" | "week" | "month"
): Promise<ApiResponse> => {
    const endpoint = "/stats";
    const url = new URL(endpoint, API_BASE_URL);

    url.searchParams.append("period", period);
    url.searchParams.append("item_id", itemId);

    logger.debug(`Fetching market data for ${itemId}`, {
        period,
        url: url.toString(),
    });

    try {
        const response = await fetch(url.toString(), {
            headers: {
                Accept: "application/json",
                "User-Agent": "Miboxi-DiscordBot/1.0",
            },
        });

        if (!response.ok) {
            const errorMessage = `API request failed with status ${response.status}`;
            logger.error(errorMessage, {
                status: response.status,
                statusText: response.statusText,
                url: url.toString(),
                itemId,
                period,
            });

            throw createApiError(
                response.status,
                response.statusText || errorMessage,
                url.toString()
            );
        }

        const data = (await response.json()) as ApiResponse;

        if (!data || typeof data !== "object") {
            logger.error("Invalid API response format", {
                itemId,
                period,
                response: data,
            });
            throw new Error("Invalid API response format");
        }

        logger.debug(`Successfully fetched market data for ${itemId}`, {
            period,
            buyOrdersCount: data.BUY?.values.length ?? 0,
            sellOrdersCount: data.SELL?.values.length ?? 0,
            response: {
                BUY: {
                    stream: data.BUY?.stream,
                    values: data.BUY?.values.map(([timestamp, price]) => ({
                        timestamp: new Date(timestamp * 1000).toISOString(),
                        price,
                    })),
                },
                DIRECT: data.DIRECT,
                SELL: {
                    stream: data.SELL?.stream,
                    values: data.SELL?.values.map(([timestamp, price]) => ({
                        timestamp: new Date(timestamp * 1000).toISOString(),
                        price,
                    })),
                },
            },
        });

        return data;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Market data fetch failed for ${itemId}`, {
                period,
                error: error.message,
                stack: error.stack,
            });
        } else {
            logger.error(`Unknown error fetching market data for ${itemId}`, {
                period,
                error,
            });
        }

        throw error;
    }
};
