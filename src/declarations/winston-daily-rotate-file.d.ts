/*
 * Miboxi, New-Gen Discord Bot
 * Copyright (c) 2024 Prism
 * SPDX-License-Identifier: MIT
 */

declare module "winston-daily-rotate-file" {
    import TransportStream, { TransportStreamOptions } from "winston-transport";

    interface DailyRotateFileTransportOptions extends TransportStreamOptions {
        filename: string;
        datePattern?: string;
        zippedArchive?: boolean;
        maxSize?: string;
        maxFiles?: string | number;
        level?: string;
    }

    class DailyRotateFile extends TransportStream {
        constructor(opts: DailyRotateFileTransportOptions);
    }

    export default DailyRotateFile;
}
