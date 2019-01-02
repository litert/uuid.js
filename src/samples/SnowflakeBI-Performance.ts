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

const factory = UUID.SnowflakeBI.createFactory({
    defaultEncoding: "hex"
});

function range(a: number, b: number) {

    return [..."0".repeat(b - a + 1)].map((v, i) => a + i);
}

const encodings: UUID.SnowflakeBI.TEncoding[] = [
    "bigint", "dec", "bin", "oct", "hex", "int64", "buffer",
    ...range(2, 36)
];

const TEST_TIMES = 10000000;

console.log("Performance");
for (let e of encodings) {

    const generator = factory.create({
        defaultEncoding: "buffer",
        workerId: 123
    });

    let timer: [number, number];

    while (1) {

        try {

            timer = process.hrtime();

            for (let i = 0; i < TEST_TIMES; i++) {

                generator(e);
            }

            timer = process.hrtime(timer);

            break;
        }
        catch (e) {

            continue;
        }
    }

    console.log(`${e.toString().padEnd(16, " ")} ${
        timer[0].toString().padStart(2, " ")
    }.${
        timer[1].toString().padEnd(10, "0").padEnd(16, " ")
    } ${ (TEST_TIMES / (timer[0] + timer[1] / 1e9) / 1000).toFixed(2) }/ms`);
}
