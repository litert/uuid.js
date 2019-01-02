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

const factory = UUID.SnowflakeSIvA.createFactory();

function verifySIvA(
    uuid: number,
    mid: number
): boolean {

    return Math.floor(uuid / Math.pow(2, UUID.SnowflakeSIvA.UIN_LENGTH)) === mid;
}

for (let i = UUID.SnowflakeSIvA.MIN_MACHINE_ID; i <= UUID.SnowflakeSIvA.MAX_MACHINE_ID; i++) {

    const genUUID = factory.create({
        "machineId": i
    });

    for (let t = 0; t < 1000; t++) {

        if (!verifySIvA(genUUID(), i)) {

            console.error(`[${i}] FAILED`);
        }
    }
}

console.info("Completed.");
