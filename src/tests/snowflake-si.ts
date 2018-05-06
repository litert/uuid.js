
// tslint:disable:no-console

import * as libuuid from "..";

const nextUUID = libuuid.SnowflakeSI.createGenerateor({

    /**
     * The ID of machine, 0 ~ 31
     */
    "mid": 1,

    /**
     * The base of clock, no change after starting using it.
     */
    "baseClock": new Date(2004, 0, 1, 0, 0, 0, 0).getTime(),

    "uinWidth": 12
});

console.log(nextUUID()); // 1101001011000100110010110010011110010110000100000000
console.log(nextUUID()); // 1101001011000100110010110010011110011100000100000001
console.log(nextUUID.MS_CAPACITY);
console.log(nextUUID.MACHINE_ID);
console.log(nextUUID.BASE_CLOCK);
console.log(Number.isSafeInteger(nextUUID()));

console.time("uuid");

for (let i = 0; i < 15000000; i++) {

    nextUUID();
}

console.timeEnd("uuid");

console.log(nextUUID() & 4095); // 1101001011000100110110101110010100000100001011100010
