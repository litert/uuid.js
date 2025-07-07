/**
 *  Copyright 2025 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * The error class for UUID.
 */
export abstract class UuidError extends Error {

    public constructor(
        /**
         * The name of the error.
         */
        name: string,
        /**
         * The message of the error.
         */
        message: string,
        /**
         * The context of the error.
         */
        public readonly ctx: Record<string, unknown> = {},
        /**
         * The metadata of the error.
         */
        public readonly origin: unknown = null
    ) {

        super(message);
        this.name = name;
    }
}

export const E_INVALID_SNOWFLAKE_SETTINGS = class extends UuidError {

    public constructor(ctx: Record<string, unknown> = {}, origin?: unknown) {

        super(
            'invalid_snowflake_settings',
            'The settings of the Snowflake generator are invalid.',
            ctx,
            origin,
        );
    }
};

export const E_TIME_REVERSED = class extends UuidError {

    public constructor(ctx: Record<string, unknown> = {}, origin?: unknown) {

        super(
            'time_reversed',
            'The time is reversed.',
            ctx,
            origin,
        );
    }
};

export const E_TIME_BEFORE_EPOCH = class extends UuidError {

    public constructor(ctx: Record<string, unknown> = {}, origin?: unknown) {

        super(
            'time_before_epoch',
            'The time is before the epoch.',
            ctx,
            origin,
        );
    }
};

export const E_SEQUENCE_OVERFLOWED = class extends UuidError {

    public constructor(ctx: Record<string, unknown> = {}, origin?: unknown) {

        super(
            'sequence_overflowed',
            'The sequence of the generator has overflowed.',
            ctx,
            origin,
        );
    }
};

export const E_INVALID_UUID = class extends UuidError {

    public constructor(ctx: Record<string, unknown> = {}, origin?: unknown) {

        super(
            'invalid_uuid',
            'The UUID is invalid',
            ctx,
            origin,
        );
    }
};
