/**
 *  Copyright 2019 Angus.Fenying <fenying@litert.org>
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

export namespace SnowflakeSIvA {

    /**
     * The bit-width of machine id field.
     */
    export const MACHINE_ID_BIT_WIDTH = 10;

    /**
     * UUID Index Number
     */
    export const UIN_LENGTH = 43;

    /**
     * The capacity of machine id.
     */
    export const MACHINE_ID_CAPACITY = Math.pow(2, MACHINE_ID_BIT_WIDTH);

    /**
     * The maximum value of machine id.
     */
    export const MAX_MACHINE_ID = MACHINE_ID_CAPACITY - 1;

    /**
     * The minimal value of machine id.
     */
    export const MIN_MACHINE_ID = 0;

    export interface IGenerateor {

        (): number;

        /**
         * The machine id.
         */
        readonly machineId: number;
    }

    export interface UUIDRange {

        /**
         * The maximum value of generated UUID.
         */
        "max": number;

        /**
         * The minimal value of generated UUID.
         */
        "min": number;
    }

    export interface IOptions {

        /**
         * The machine ID.
         */
        "machineId": number;

        /**
         * The cursor of the incremental sequence.
         *
         * Default: 0
         */
        "cursor"?: number;
    }

    export interface IFactory {

        /**
         * Create a Snowflake-SI-vA UUID generator.
         *
         * @param opts The options of new generator.
         */
        create(opts: IOptions): IGenerateor;

        /**
         * Calculate the cursor of UUID generator.
         *
         * @param lastUUID The last generated UUID.
         */
        calculateCursor(lastUUID: number): number;

        /**
         * Calculate the maximum and minimal value of UUID output, by a
         * specified id of machine.
         *
         * @param machineId The id of machine.
         */
        calculateRangeByMID(machineId: number): UUIDRange;
    }

    class Factory implements IFactory {

        public calculateRangeByMID(mid: number): UUIDRange {

            const MAX_MID = Math.pow(2, MACHINE_ID_BIT_WIDTH);

            if (mid >= MACHINE_ID_CAPACITY || mid < 0) {

                throw new RangeError(`mid must be between 0 and ${MAX_MID - 1}.`);
            }

            const BASE = Math.pow(2, UIN_LENGTH);

            return {
                max: mid * BASE + BASE - 1,
                min: mid * BASE
            };
        }

        public calculateCursor(lastUUID: number): number {

            const result = Math.floor(
                lastUUID / Math.pow(2, MACHINE_ID_BIT_WIDTH)
            ) - Date.now();

            if (result >= 0) {

                return result + 1;
            }

            return 0;
        }

        public create(opts: IOptions): IGenerateor {

            if (opts.machineId >= MACHINE_ID_CAPACITY || opts.machineId < MIN_MACHINE_ID) {

                throw new RangeError(`mid must be between 0 and ${MACHINE_ID_CAPACITY - 1}.`);
            }

            const MID_FIELD = opts.machineId * Math.pow(2, UIN_LENGTH);

            return (new Function(`
let cursor = ${opts.cursor || 0};

return Object.defineProperties(function() {
    return ${MID_FIELD} + Date.now() + cursor++;
}, {
    "machineId": {
        value: ${opts.machineId},
        writable: false,
        configurable: false
    }
});
`))() as any;
        }
    }

    export function createFactory(): IFactory {

        return new Factory();
    }
}
