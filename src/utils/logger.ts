/*
 * Miboxi, New-Gen Discord Bot
 * Copyright (c) 2024 Prism
 * SPDX-License-Identifier: MIT
 */

import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import {
    addColors,
    createLogger,
    format,
    Logger as WinstonLogger,
    transports,
} from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const customLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
} as const;

type LogLevel = keyof typeof customLevels;

const customColors: { [key in LogLevel]: string } = {
    fatal: "magenta",
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "blue",
    trace: "gray",
};

addColors(customColors);

interface LoggerConfig {
    logToFile?: boolean;
    logFilePath?: string;
    minimumLogLevel?: LogLevel;
}

const defaultConfig: Required<LoggerConfig> = {
    logToFile: false,
    logFilePath: join(__dirname, "../../logs/bot.log"),
    minimumLogLevel: "trace",
};

class Logger {
    private logToFile: boolean;
    private logFilePath: string;
    private minimumLogLevel: LogLevel;
    private logger: WinstonLogger;

    constructor(config: LoggerConfig = {}) {
        this.logToFile = config.logToFile ?? defaultConfig.logToFile;
        this.logFilePath = config.logFilePath ?? defaultConfig.logFilePath;
        this.minimumLogLevel =
            config.minimumLogLevel ?? defaultConfig.minimumLogLevel;

        if (this.logToFile) {
            const logDir = join(this.logFilePath, "..");
            if (!existsSync(logDir)) {
                mkdirSync(logDir, { recursive: true });
            }
        }

        this.logger = createLogger({
            levels: customLevels,
            level: this.minimumLogLevel,
            format: format.combine(
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                format.colorize(),
                format.printf(
                    ({ timestamp, level, message, ...meta }) =>
                        `${timestamp} [${level}]: ${message} ${
                            Object.keys(meta).length
                                ? JSON.stringify(meta, null, 2)
                                : ""
                        }`
                )
            ),
            transports: [
                new transports.Console(),
                ...(this.logToFile
                    ? [
                          new DailyRotateFile({
                              filename: join(
                                  this.logFilePath,
                                  "error-%DATE%.log"
                              ),
                              datePattern: "YYYY-MM-DD",
                              level: "error",
                              zippedArchive: true,
                              maxSize: "20m",
                              maxFiles: "14d",
                          }),
                          new DailyRotateFile({
                              filename: join(
                                  this.logFilePath,
                                  "combined-%DATE%.log"
                              ),
                              datePattern: "YYYY-MM-DD",
                              zippedArchive: true,
                              maxSize: "20m",
                              maxFiles: "14d",
                          }),
                      ]
                    : []),
            ],
            exitOnError: false,
        });
    }

    public fatal(message: string, meta?: Record<string, unknown>) {
        this.logger.log("fatal", message, meta);
    }

    public error(message: string, meta?: Record<string, unknown>) {
        this.logger.log("error", message, meta);
    }

    public warn(message: string, meta?: Record<string, unknown>) {
        this.logger.log("warn", message, meta);
    }

    public info(message: string, meta?: Record<string, unknown>) {
        this.logger.log("info", message, meta);
    }

    public debug(message: string, meta?: Record<string, unknown>) {
        this.logger.log("debug", message, meta);
    }

    public trace(message: string, meta?: Record<string, unknown>) {
        this.logger.log("trace", message, meta);
    }
}

export default new Logger({
    logToFile: true,
    logFilePath: join(__dirname, "../../logs/bot.log"),
    minimumLogLevel: "debug",
});
