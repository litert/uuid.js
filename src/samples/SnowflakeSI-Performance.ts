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

const TEST_TIMES = 10000000;

const perfGen = factory.create();

let timer = process.hrtime();

for (let i = 0; i < TEST_TIMES; i++) {

    perfGen();
}

timer = process.hrtime(timer);

console.log("Performance");
console.log(`SnowflakeSI     ${
    timer[0].toString().padStart(2, " ")
}.${
    timer[1].toString().padEnd(10, "0").padEnd(16, " ")
} ${ (TEST_TIMES / (timer[0] + timer[1] / 1e9) / 1000).toFixed(2) }/ms`);
