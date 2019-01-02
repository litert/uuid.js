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

import * as Errors from "./Errors";
import * as U from "./Utils";

export namespace SnowflakeBI {

    export type TEncoding = number |
                            "hex" | "bin" | "oct" | "dec" |
                            "int64" | "buffer" | "bigint";

    export interface IUInt64 {

        /**
         * The high 32 bits of UUID.
         */
        "hi": number;

        /**
         * The low 32 bits of UUID.
         */
        "lo": number;
    }

    export interface IFactoryOptions<E extends TEncoding> {

        /**
         * The output encoding of UUID.
         *
         * @default "dec"
         */
        "defaultEncoding"?: E;

        /**
         * Thw bit witdh of machine field.
         *
         * @default 5
         */
        "machineBitWidth"?: number;

        /**
         * Thw bit witdh of IDC field.
         *
         * @default 5
         */
        "idcBitWidth"?: number;
    }

    export interface IOptions<E extends TEncoding>
    extends IFactoryOptions<E> {

        /**
         * The ID of machine.
         *
         * @default 0
         */
        "machineId"?: number;

        /**
         * The ID of IDC.
         *
         * @default 0
         */
        "idcId"?: number;

        /**
         * The id of worker.
         *
         * @default 0
         */
        "workerId"?: number;
    }

    export type TGeneratorOutput<E> = E extends "int64" ? IUInt64 :
                                      E extends "buffer" ? Buffer :
                                      E extends "bigint" ? any :
                                      string;

    export interface IGenerateorBasicInfo<E extends TEncoding> {

        /**
         * The capacity of worker id.
         */
        readonly workerCapacity: number;

        /**
         * The bit-width of worker id field.
         */
        readonly workerBitWidth: number;

        /**
         * The bit-width of IDC id field.
         */
        readonly idcBitWidth: number;

        /**
         * The capacity of IDC id.
         */
        readonly idcCapacity: number;

        /**
         * The bit-width of machine id field.
         */
        readonly machineBitWidth: number;

        /**
         * The capacity of machine id.
         */
        readonly machineCapacity: number;

        /**
         * The default encoding of UUID output.
         */
        readonly defaultEncoding: E;
    }

    export interface IGenerateor<E extends TEncoding>
    extends IGenerateorBasicInfo<E> {

        (encoding?: E): TGeneratorOutput<E>;

        <T extends TEncoding>(encoding: T): TGeneratorOutput<T>;

        /**
         * The machine id that current generator uses.
         */
        readonly machineId: number;

        /**
         * The IDC id that current generator uses.
         */
        readonly idcId: number;

        /**
         * The worker id that current generator uses.
         */
        readonly workerId: number;

        /**
         * The sequence of current generator
         */
        readonly sequence: number;

        /**
         * The clock of previous uuid.
         */
        readonly clock: number;
    }

    export type TDefaultEncoding = "dec";

    export interface IFactory<E extends TEncoding = TDefaultEncoding>
    extends IGenerateorBasicInfo<E> {

        /**
         * Create a new Snowflake UUID generator.
         * @param options The options of generator.
         */
        create<T extends TEncoding = E>(options?: IOptions<T>): IGenerateor<T>;
    }

    /**
     * The capacity of worker id.
     */
    export const WORKER_ID_CAPACITY: number = 1024;

    /**
     * The maximum value of worker id.
     */
    export const MAX_WORKER_ID: number = WORKER_ID_CAPACITY - 1;

    /**
     * The manimal value of worker id.
     */
    export const MIN_WORKER_ID: number = 0;

    /**
     * The bit-width of worker id.
     */
    export const WORKER_ID_BIT_WIDTH: number = 10;

    /**
     * The bit-width of sequence field.
     */
    export const SEQUENCE_BIT_WIDTH: number = 12;

    /**
     * The default encoding of UUID output.
     */
    export const DEFAULT_ENCODING: TDefaultEncoding = "dec";

    /**
     * The default worker id.
     */
    export const DEFAULT_WORKER_ID: number = 0;

    /**
     * The default bit-width of IDC id.
     */
    export const DEFAULT_IDC_BIT_WIDTH: number = 5;

    /**
     * The default bit-width of machine id.
     */
    export const DEFAULT_MACHINE_BIT_WIDTH: number = 5;

    /**
     * The minimal bit-width of IDC id.
     */
    export const MIN_IDC_BIT_WIDTH: number = 0;

    /**
     * The minimal bit-width of machine id.
     */
    export const MIN_MACHINE_BIT_WIDTH: number = 0;

    /**
     * The maximum bit-width of IDC id.
     */
    export const MAX_IDC_BIT_WIDTH: number = WORKER_ID_BIT_WIDTH;

    /**
     * The maximum bit-width of machine id.
     */
    export const MAX_MACHINE_BIT_WIDTH: number = WORKER_ID_BIT_WIDTH;

    const DEFAULT_FACTORY_OPTIONS: Required<IFactoryOptions<TDefaultEncoding>> = {

        "defaultEncoding": DEFAULT_ENCODING,
        "idcBitWidth": DEFAULT_IDC_BIT_WIDTH,
        "machineBitWidth": DEFAULT_MACHINE_BIT_WIDTH
    };

    const DEFAULT_OPTIONS: Required<IOptions<TDefaultEncoding>> = {

        "defaultEncoding": DEFAULT_ENCODING,
        "idcBitWidth": DEFAULT_FACTORY_OPTIONS.idcBitWidth,
        "idcId": 0,
        "machineBitWidth": DEFAULT_FACTORY_OPTIONS.machineBitWidth,
        "machineId": 0,
        "workerId": 0
    };

    class Factory implements IFactory<any> {

        private _defaultEncoding: TEncoding;

        private _idcCap: number;

        private _idcBits: number;

        private _macCap: number;

        private _macBits: number;

        public get defaultEncoding(): any {

            return this._defaultEncoding;
        }

        public get idcBitWidth(): number {

            return this._idcBits;
        }

        public get machineBitWidth(): number {

            return this._macBits;
        }

        public get idcCapacity(): number {

            return this._idcCap;
        }

        public get machineCapacity(): number {

            return this._macCap;
        }

        public readonly workerCapacity: number = WORKER_ID_CAPACITY;

        public readonly workerBitWidth: number = WORKER_ID_BIT_WIDTH;

        public constructor(opts: IFactoryOptions<any>) {

            this._defaultEncoding = opts.defaultEncoding || DEFAULT_OPTIONS.defaultEncoding;

            if (
                opts.idcBitWidth === undefined &&
                opts.machineBitWidth === undefined
            ) {

                this._idcBits = DEFAULT_OPTIONS.idcBitWidth;
                this._macBits = DEFAULT_OPTIONS.machineBitWidth;
            }
            else {

                if (
                    opts.idcBitWidth !== undefined &&
                    opts.machineBitWidth !== undefined
                ) {

                    this._idcBits = opts.idcBitWidth;
                    this._macBits = opts.machineBitWidth;
                }
                else if (opts.idcBitWidth !== undefined) {

                    this._idcBits = opts.idcBitWidth;
                    this._macBits = 10 - opts.idcBitWidth;
                }
                else if (opts.machineBitWidth !== undefined) {

                    this._macBits = opts.machineBitWidth;
                    this._idcBits = 10 - this._macBits;
                }
            }

            this._idcCap = 1 << this._idcBits;
            this._macCap = 1 << this._macBits;

            this._validateFactoryOptions({
                idcBitWidth: this._idcBits,
                machineBitWidth: this.machineBitWidth,
                defaultEncoding: this._defaultEncoding
            });
        }

        private _validateFactoryOptions(opts: Required<IFactoryOptions<any>>): void {

            if (typeof opts.defaultEncoding === "number") {

                if (
                    !Number.isInteger(opts.defaultEncoding) ||
                    opts.defaultEncoding > 36 || opts.defaultEncoding < 2
                ) {

                    throw new Errors.E_INVALID_RADIX_ENCODING({
                        "metadata": { "encoding": opts.defaultEncoding }
                    });
                }
            }

            if (
                opts.idcBitWidth < MIN_IDC_BIT_WIDTH ||
                opts.idcBitWidth > MAX_IDC_BIT_WIDTH
            ) {

                throw new Errors.E_INVALID_IDC_BIT_WIDTH({
                    "metadata": { "idcBitWidth": opts.idcBitWidth }
                });
            }

            if (
                opts.machineBitWidth < MIN_MACHINE_BIT_WIDTH ||
                opts.machineBitWidth > MAX_MACHINE_BIT_WIDTH
            ) {

                throw new Errors.E_INVALID_IDC_BIT_WIDTH({
                    "metadata": {
                        "idcBitWidth": opts.idcBitWidth,
                        "machineBitWidth": opts.machineBitWidth
                    }
                });
            }

            if (opts.machineBitWidth + opts.idcBitWidth > WORKER_ID_BIT_WIDTH) {

                throw new Errors.E_INVALID_WORKER_BIT_WIDTH({
                    "metadata": {
                        "idcBitWidth": opts.idcBitWidth,
                        "machineBitWidth": opts.machineBitWidth
                    }
                });
            }
        }

        private _validateGeneratorOptions(opts: Required<IOptions<any>>): void {

            this._validateFactoryOptions(opts);

            const idcCapacity = 1 << opts.idcBitWidth;
            const macCapacity = 1 << opts.machineBitWidth;

            if (opts.idcId < 0 || opts.idcId >= idcCapacity) {

                throw new Errors.E_INVALID_IDC_ID({
                    "metadata": {
                        idcCapacity,
                        "idcId": opts.idcId
                    }
                });
            }

            if (opts.machineId < 0 || opts.machineId >= macCapacity) {

                throw new Errors.E_INVALID_MACHINE_ID({
                    "metadata": {
                        "machineCapacity": macCapacity,
                        "machineId": opts.machineId
                    }
                });
            }

            if (opts.workerId < MIN_WORKER_ID || opts.workerId > MAX_WORKER_ID) {

                throw new Errors.E_INVALID_WORKER_ID({
                    "metadata": {
                        "workerCapacity": WORKER_ID_CAPACITY,
                        "workerId": opts.workerId
                    }
                });
            }
        }

        private _makeWorkerId(opts: Required<IOptions<any>>): number {

            return (opts.idcId << opts.machineBitWidth) |  opts.machineId;
        }

        public create(inOpts: IOptions<any> = {}): IGenerateor<any> {

            const opts: Required<IOptions<any>> = {

                "workerId": U.defaultValue(
                    inOpts.workerId,
                    DEFAULT_OPTIONS.workerId
                ),
                "idcId": U.defaultValue(
                    inOpts.idcId,
                    DEFAULT_OPTIONS.idcId
                ),
                "machineId": U.defaultValue(
                    inOpts.machineId,
                    DEFAULT_OPTIONS.machineId
                ),
                "idcBitWidth": U.defaultValue(
                    inOpts.idcBitWidth,
                    this._idcBits
                ),
                "machineBitWidth": U.defaultValue(
                    inOpts.machineBitWidth,
                    this._macBits
                ),
                "defaultEncoding": U.defaultValue(
                    inOpts.defaultEncoding,
                    this._defaultEncoding
                ),
            };

            this._validateGeneratorOptions(opts);

            const idcCapacity = 1 << opts.idcBitWidth;
            const macCapacity = 1 << opts.machineBitWidth;

            const WORKER_ID = inOpts.workerId !== undefined ?
                opts.workerId :
                this._makeWorkerId(opts);

            if (inOpts.workerId !== undefined) {

                opts.idcId = WORKER_ID >> opts.machineBitWidth;
                opts.machineId = WORKER_ID & ((1 << opts.idcBitWidth) - 1);
            }

            const genByInt32: string = `{
    "hi": (NOW / 0x400) >>> 0,
    "lo": (index++ | ${WORKER_ID << SEQUENCE_BIT_WIDTH} | ((NOW & 0x3FF) << ${
        WORKER_ID_BIT_WIDTH + SEQUENCE_BIT_WIDTH
    })) >>> 0
}`;

            const genByBigInt: string = `(BigInt((NOW / 0x400) >>> 0) << n32) +
BigInt((index++ | ${WORKER_ID << SEQUENCE_BIT_WIDTH} | ((NOW & 0x3FF) << ${
    WORKER_ID_BIT_WIDTH + SEQUENCE_BIT_WIDTH
})) >>> 0)`;

            let code: string = `
if (global.BigInt === undefined) {

    throw new Errors.E_BIGINT_NOT_SUPPROTED();
}

let index = 0;
let prevTime = 0;

const n32 = 32n;

const snowflake = function(enc = ${JSON.stringify(opts.defaultEncoding)}) {

    const NOW = Date.now();

    if (NOW < prevTime) {

        throw new Errors.E_CLOCK_BACKWARD({
            "metadata": {
                "clock": prevTime,
                "currentClock": NOW
            }
        });
    }

    if (NOW !== prevTime) {

        index = 0;
        prevTime = NOW;
    }

    switch (enc) {
    case "buffer":

        let ret = Buffer.alloc(8);

        const uuid = ${genByInt32};

        ret.writeUInt32LE(uuid.lo, 0);
        ret.writeUInt32LE(uuid.hi, 4);

        return ret;

    case "int64":   return ${genByInt32};
    case "bigint":  return ${genByBigInt};
    case "bin":     return (${genByBigInt}).toString(2);
    case "oct":     return (${genByBigInt}).toString(8);
    case "hex":     return (${genByBigInt}).toString(16);
    case "dec":     return (${genByBigInt}).toString(10);
    default:        return (${genByBigInt}).toString(enc);
    }
};

Object.defineProperties(snowflake, {
    "clock": {
        configurable: false,
        get() {
            return prevTime;
        }
    },
    "sequence": {
        configurable: false,
        get() {
            return index;
        }
    },
    "workerId": {
        writable: false,
        configurable: false,
        value: ${WORKER_ID}
    },
    "workerBitWidth": {
        writable: false,
        configurable: false,
        value: ${WORKER_ID_BIT_WIDTH}
    },
    "workerCapacity": {
        writable: false,
        configurable: false,
        value: ${WORKER_ID_CAPACITY}
    },
    "idcId": {
        writable: false,
        configurable: false,
        value: ${opts.idcId}
    },
    "idcBitWidth": {
        writable: false,
        configurable: false,
        value: ${opts.idcBitWidth}
    },
    "idcCapacity": {
        writable: false,
        configurable: false,
        value: ${idcCapacity}
    },
    "machineId": {
        writable: false,
        configurable: false,
        value: ${opts.machineId}
    },
    "machineBitWidth": {
        writable: false,
        configurable: false,
        value: ${opts.machineBitWidth}
    },
    "machineCapacity": {
        writable: false,
        configurable: false,
        value: ${macCapacity}
    },
    "defaultEncoding": {
        writable: false,
        configurable: false,
        value: ${JSON.stringify(opts.defaultEncoding)}
    }
});

return snowflake;
`;

            return (new Function(`Errors`, code))(Errors);
        }
    }

    export function createFactory<E extends TEncoding = TDefaultEncoding>(
        options: IFactoryOptions<E> = DEFAULT_FACTORY_OPTIONS as any
    ): IFactory<E> {

        return new Factory(options);
    }
}
