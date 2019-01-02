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

// tslint:disable:no-console
import * as UUID from "../libs";

const baseClock = new Date("2011-11-11 11:11:11").getTime();

const factory = UUID.SnowflakeSI.createFactory({ baseClock });

function verifySI(
    uuid: number,
    mid: number,
    ibw: number
): boolean {

    return ((uuid & 8191) >> ibw) === mid;
}

for (let i = UUID.SnowflakeSI.MIN_UIN_BIT_WIDTH; i <= UUID.SnowflakeSI.MAX_UIN_BIT_WIDTH; i++) {

    const MAX_MAC_ID = factory.calculateMachineIdCapacity(i);

    for (let j = 0; j <= MAX_MAC_ID; j++) {

        try {

            const genUUID = factory.create({
                machineId: j,
                uinBitWidth: i
            });

            const TIMES = genUUID.uinCapacity * 2;

            for (let t = 0; t < TIMES; t++) {

                if (!verifySI(genUUID(), j, i)) {

                    console.error(`[${i}:${j}] FAILED`);
                }
            }
        }
        catch (e) {

            if (e instanceof UUID.E_INVALID_MACHINE_ID) {

                console.info(`[${i}:${j}] OK: MachineId ${j} DENIED BY MAX ${MAX_MAC_ID}`);
                continue;
            }
        }
    }
}
