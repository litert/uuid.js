/*
   +----------------------------------------------------------------------+
   | LiteRT UUID.js Library                                               |
   +----------------------------------------------------------------------+
   | Copyright (c) 2018 Fenying Studio                                    |
   +----------------------------------------------------------------------+
   | This source file is subject to version 2.0 of the Apache license,    |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | https://github.com/litert/uuid.js/blob/master/LICENSE                |
   +----------------------------------------------------------------------+
   | Authors: Angus Fenying <fenying@litert.org>                          |
   +----------------------------------------------------------------------+
 */

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
