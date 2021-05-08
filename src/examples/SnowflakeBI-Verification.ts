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

// tslint:disable:no-console
import * as UUID from '../libs';

const factory = UUID.SnowflakeBI.createFactory();

function verifyStringByIM(
    uuid: string,
    ibw: number,
    mbw: number,
    idc: number,
    mid: number
): void {

    if (mbw > 0) {

        const U_MID = parseInt(uuid.slice(-12 - mbw, -12), 2);

        if (U_MID !== mid) {

            console.error(`ERR: Machine ID ${U_MID} not matched expectation ${mid}.`);
            return;
        }
    }

    if (ibw > 0) {

        const U_IDC = parseInt(uuid.slice(-12 - mbw - ibw, -12 - mbw), 2);

        if (U_IDC !== idc) {

            console.error(`ERR: IDC ID ${U_IDC} not matched expectation ${idc}.`);
            return;
        }
    }
}

function verifyStringByWorkerId(
    uuid: string,
    worker: number
): void {

    const U_WORKER = parseInt(uuid.slice(-22, -12), 2);

    if (U_WORKER !== worker) {

        console.error(`ERR: Worker ID ${U_WORKER} not matched expectation ${worker}.`);
        return;
    }
}

for (
    let ibw = UUID.SnowflakeBI.MIN_IDC_BIT_WIDTH - 1;
    ibw <= UUID.SnowflakeBI.MAX_IDC_BIT_WIDTH + 1;
    ibw++
) {

    for (
        let mbw = UUID.SnowflakeBI.MIN_MACHINE_BIT_WIDTH - 1;
        mbw <= UUID.SnowflakeBI.MAX_MACHINE_BIT_WIDTH + 1;
        mbw++
    ) {

        try {

            const MACHINE_ID = Math.floor((1 << mbw) / 2);

            const IDC_ID = Math.floor((1 << ibw) / 2);

            const genUUID = factory.create({
                defaultEncoding: 'bin',
                idcBitWidth: ibw,
                idcId: IDC_ID,
                machineBitWidth: mbw,
                machineId: MACHINE_ID
            });

            const U0 = genUUID();
            const U1 = genUUID();

            verifyStringByIM(
                U0,
                ibw,
                mbw,
                IDC_ID,
                MACHINE_ID
            );

            verifyStringByIM(
                U1,
                ibw,
                mbw,
                IDC_ID,
                MACHINE_ID
            );
        }
        catch (e) {

            if (
                e instanceof UUID.E_INVALID_IDC_BIT_WIDTH ||
                e instanceof UUID.E_INVALID_MACHINE_BIT_WIDTH ||
                e instanceof UUID.E_INVALID_WORKER_BIT_WIDTH
            ) {

                console.error(`OK: IBW ${ibw} + MBW ${mbw} makes error.`);
            }
            else {

                console.error(e);
            }
        }
    }
}

for (
    let worker = UUID.SnowflakeBI.MIN_WORKER_ID - 1;
    worker <= UUID.SnowflakeBI.MAX_WORKER_ID + 1;
    worker++
) {

    try {

        const genUUID = factory.create({
            defaultEncoding: 'bin',
            workerId: worker
        });

        const U0 = genUUID();
        const U1 = genUUID();

        verifyStringByWorkerId(
            U0,
            worker
        );

        verifyStringByWorkerId(
            U1,
            worker
        );
    }
    catch (e) {

        if (e instanceof UUID.E_INVALID_WORKER_ID) {

            console.error(`OK: Worker ID ${worker} makes error.`);
        }
        else {

            console.error(e);
        }
    }
}
