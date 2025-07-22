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
import * as eL from './Errors';

export type ISnowflakeOptions = Pick<SnowflakeGenerator, 'machineId'> & Partial<Pick<SnowflakeGenerator, 'epoch'>>;

const BI_OFFSET_TIMESTAMP = 22n;
const BI_OFFSET_MAC_ID = 12n;
const MAX_SEQUENCE_NUMBER = 4095;
const BI_MAX_SEQUENCE_NUMBER = BigInt(MAX_SEQUENCE_NUMBER);

/**
 * The class for generating Snowflake IDs.
 */
export class SnowflakeGenerator {

    /**
     * The minimum machine ID that can be used by the generator.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly MIN_MACHINE_ID = 0;

    /**
     * The maximum machine ID that can be used by the generator.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly MAX_MACHINE_ID = 1023;

    /**
     * The identifier of the machine that generates the UUID.
     *
     * For the snowflake ID of a specific resource, each generator must use a unique machine ID
     * so that the generated IDs will not conflict with each other.
     *
     * @range 0 - 1023
     */
    public readonly machineId: number;

    /**
     * The epoch of the generator.
     *
     * The value is recommended to be the time when the service/application goes online.
     *
     * @default 0
     */
    public readonly epoch: number;

    private readonly _biInstId: bigint;

    private _prevTime: number = 0;

    private _seq: bigint = 0n;

    private _countPerMs = 0;

    public constructor(options: ISnowflakeOptions) {

        if (!Number.isInteger(options.machineId) ||
            options.machineId < SnowflakeGenerator.MIN_MACHINE_ID ||
            options.machineId > SnowflakeGenerator.MAX_MACHINE_ID
        ) {

            throw new eL.E_INVALID_SNOWFLAKE_SETTINGS({
                'reason': 'invalid_machine_id',
                'machineId': options.machineId,
            });
        }

        this.machineId = options.machineId;
        this.epoch = options.epoch ?? 0;

        if (typeof this.epoch !== 'number' || !Number.isSafeInteger(this.epoch) || this.epoch < 0) {

            throw new eL.E_INVALID_SNOWFLAKE_SETTINGS({
                'reason': 'invalid_epoch',
                'epoch': this.epoch,
            });
        }

        this._biInstId = BigInt(options.machineId) << BI_OFFSET_MAC_ID;
    }

    /**
     * Generate the next Snowflake ID, based on the current time and the next sequence number.
     *
     * @returns A Snowflake ID, which is a 64-bit integer (BigInt).
     *
     * @throws {E_TIME_REVERSED} If the current time is earlier than the previous time.
     * @throws {E_SEQUENCE_OVERFLOWED} If the sequence number exceeds the maximum value.
     * @throws {E_TIME_BEFORE_EPOCH} If the current time is before the epoch.
     */
    public generate(): bigint {

        const now = Date.now();

        if (now < this.epoch) {

            throw new eL.E_TIME_BEFORE_EPOCH({ epoch: this.epoch, time: now });
        }

        const t = now - this.epoch;

        if (this._prevTime > t) {

            throw new eL.E_TIME_REVERSED({ previous: this._prevTime, current: t });
        }

        if (this._prevTime !== t) {

            this._prevTime = t;
            this._countPerMs = 0;
        }
        else if (this._countPerMs > MAX_SEQUENCE_NUMBER) {

            throw new eL.E_SEQUENCE_OVERFLOWED();
        }

        this._countPerMs++;

        return (BigInt(t) << BI_OFFSET_TIMESTAMP) + this._biInstId + (this._seq++ & BI_MAX_SEQUENCE_NUMBER);
    }

    /**
     * Generate a Snowflake ID by specifying the timestamp and sequence number.
     *
     * @param timestamp The timestamp to use for the ID.
     * @param sequence The sequence number to use for the ID (0 ~ 4095).
     *
     * @returns A Snowflake ID, which is a 64-bit integer (BigInt).
     *
     * @throws {E_SEQUENCE_OVERFLOWED} If the sequence number exceeds the maximum value.
     * @throws {E_TIME_BEFORE_EPOCH} If the timestamp is before the epoch.
     */
    public generateBy(timestamp: number, sequence: number): bigint {

        if (sequence > MAX_SEQUENCE_NUMBER) {

            throw new eL.E_SEQUENCE_OVERFLOWED({ sequence });
        }

        if (timestamp < this.epoch) {

            throw new eL.E_TIME_BEFORE_EPOCH({ epoch: this.epoch, time: timestamp });
        }

        return (BigInt(timestamp - this.epoch) << BI_OFFSET_TIMESTAMP) + this._biInstId + BigInt(sequence);
    }
}
