/**
 *  Copyright 2021 Angus.Fenying <fenying@litert.org>
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

import * as Errors from './Errors';
import * as U from './Utils';

export interface IGenerateor {

    (): number;

    /**
     * The machine ID.
     */
    readonly machineId: number;

    /**
     * The capacity of UIN. It's equal to the number of UUID that could be
     * generated per millisecond.
     *
     * This is a hard limitation by the `uinBitWidth`.
     */
    readonly uinCapacity: number;

    /**
     * The bit-width of UUID index number.
     */
    readonly uinBitWidth: number;

    /**
     * The base-clock of service.
     */
    readonly baseClock: number;
}

export interface IFactoryOptions {

    /**
     * The base-clock of service.
     */
    'baseClock'?: number;

    /**
     * The bit-width of UUID index number.
     */
    'uinBitWidth'?: number;
}

export interface IOptions {

    /**
     * The base-clock of service.
     */
    'baseClock'?: number;

    /**
     * The bit-width of UUID index number.
     */
    'uinBitWidth'?: number;

    /**
     * The machine ID.
     */
    'machineId'?: number;
}

export interface IFactory {

    /**
     * Create a UUID generator using Snowflake-SI algorithm.
     *
     * @param opts The options of the new generator.
     */
    create(opts?: IOptions): IGenerateor;

    /**
     * Calculate the capacity of the machine id, by a specific bit-width of
     * UUID index number.
     *
     * @param uinBitWidth The bit-width of UUID index number.
     */
    calculateMachineIdCapacity(uinBitWidth: number): number;

    /**
     * Calculate the capacity of the UIN, by a specific bit-width of
     * UUID index number.
     *
     * @param uinBitWidth The bit-width of UUID index number.
     */
    calculateUINCapacity(uinBitWidth: number): number;
}

/**
 * The default bit-width of UUID index number field.
 */
export const DEFAULT_UIN_BIT_WIDTH = 8;

/**
 * The maximum bit-width of UUID index number field.
 */
export const MAX_UIN_BIT_WIDTH = 13;

/**
 * The minimal bit-width of UUID index number field.
 */
export const MIN_UIN_BIT_WIDTH = 1;

/**
 * Minimal base clock, 2003-03-18T07:20:19.225Z.
 */
export const MIN_BASE_CLOCK = 1047972019225;

class Factory implements IFactory {

    private _baseClock: number;

    private _uinBitWidth: number;

    public constructor(opts?: IFactoryOptions) {

        this._baseClock = opts ? opts.baseClock : 0;
        this._uinBitWidth = opts ?
            opts.uinBitWidth || DEFAULT_UIN_BIT_WIDTH :
            DEFAULT_UIN_BIT_WIDTH;
    }

    public calculateMachineIdCapacity(uinBitWidth: number): number {

        return 1 << (MAX_UIN_BIT_WIDTH - uinBitWidth);
    }

    public calculateUINCapacity(uinBitWidth: number): number {

        return 1 << uinBitWidth;
    }

    public create(opts?: IOptions): IGenerateor {

        const ibw = U.defaultValue(
            opts ? opts.uinBitWidth : undefined,
            this._uinBitWidth
        );

        const BC = U.defaultValue(
            opts ? opts.baseClock : undefined,
            this._baseClock
        );

        const MID = U.defaultValue(
            opts ? opts.machineId : 0,
            0
        );

        if (ibw > MAX_UIN_BIT_WIDTH || ibw < MIN_UIN_BIT_WIDTH) {

            throw new Errors.E_INVALID_UIN_BIT_WIDTH({
                'metadata': opts
            });
        }

        if (BC < MIN_BASE_CLOCK) {

            throw new Errors.E_INVALID_BASE_CLOCK({
                'metadata': opts
            });
        }

        const MAX_UIN = this.calculateUINCapacity(ibw);

        const MAX_MID = this.calculateMachineIdCapacity(ibw);

        if (MID >= MAX_MID || MID < 0) {

            throw new Errors.E_INVALID_MACHINE_ID({
                'metadata': opts
            });
        }

        let ret: any;

        if (MAX_MID !== 1) {

            const MID_FIELD = MID * MAX_UIN;

            ret = (new Function(`
let index = 0;
return function() {
return ${MID_FIELD} + (Date.now() - ${BC}) * 8192 + (index++ & ${MAX_UIN - 1});
};
`))();
        }
        else {

            ret = (new Function(`
let index = 0;
return function() {
return (Date.now() - ${BC}) * 8192 + (index++ & 8191);
};
`))();
        }

        Object.defineProperties(ret, {
            'uinCapacity': {
                value: MAX_UIN,
                writable: false,
                configurable: false
            },
            'baseClock': {
                value: BC,
                writable: false,
                configurable: false
            },
            'machineId': {
                value: MID,
                writable: false,
                configurable: false
            },
            'uinBitWidth': {
                value: ibw,
                writable: false,
                configurable: false
            }
        });

        return ret;
    }
}

/**
 * Create a new factory of Snowflake-SI UUID generator.
 */
export function createFactory(opts?: IFactoryOptions): IFactory {

    return new Factory(opts);
}
