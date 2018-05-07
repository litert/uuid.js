/*
   +----------------------------------------------------------------------+
   | LiteRT UUID.js Library                                               |
   +----------------------------------------------------------------------+
   | Copyright (c) 2018 Fenying Studio                                    |
   +----------------------------------------------------------------------+
   | This source file is subject to version 2.0 of the Apache license,    |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | https://github.com/litert/uuid.js/blob/master/LICENSE                |
   +----------------------------------------------------------------------+
   | Authors: Angus Fenying <fenying@litert.org>                          |
   +----------------------------------------------------------------------+
 */

export namespace SnowflakeSIvA {

    export interface UUIDGenerateor {

        (): number;

        readonly MACHINE_ID: number;
    }

    /**
     * Machine ID
     */
    const MID_LENGTH = 10;

    /**
     * UUID Index Number
     */
    const UIN_LENGTH = 43;

    export function calculateCursor(lastUUID: number): number {

        const result = Math.floor(
            lastUUID / Math.pow(2, MID_LENGTH)
        ) - Date.now();

        if (result >= 0) {

            return result + 1;
        }

        return 0;
    }

    export interface UUIDRange {

        max: number;

        min: number;
    }

    export function getUUIDRangeByMID(mid: number): UUIDRange {

        const MAX_MID = Math.pow(2, MID_LENGTH);

        if (mid >= MAX_MID || mid < 0) {

            throw new RangeError(`mid must be between 0 and ${MAX_MID - 1}.`);
        }

        const BASE = Math.pow(2, UIN_LENGTH);

        return {
            max: mid * BASE + BASE - 1,
            min: mid * BASE
        };
    }

    export function createGenerateor(opts: {

        /**
         * The machine ID.
         */
        mid: number;

        /**
         * The cursor of the incremental sequence.
         *
         * Default: 0
         */
        cursor?: number;

    }): UUIDGenerateor{

        const MAX_MID = Math.pow(2, MID_LENGTH);

        if (opts.mid >= MAX_MID || opts.mid < 0) {

            throw new RangeError(`mid must be between 0 and ${MAX_MID - 1}.`);
        }

        let cursor: number = opts.cursor || 0;

        let ret: any;

        const MID_FIELD = opts.mid * Math.pow(2, UIN_LENGTH);

        ret = function(): number {

            return MID_FIELD + Date.now() + cursor++;
        };

        Object.defineProperty(ret, "MACHINE_ID", {
            value: opts.mid,
            writable: false,
            configurable: false
        });

        return ret;
    }

}
