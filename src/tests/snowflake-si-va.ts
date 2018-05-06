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

const nextUUID = libuuid.SnowflakeSIvA.createGenerateor({

    /**
     * The ID of machine, 0 ~ 31
     */
    "mid": 1023,

    "cursor": libuuid.SnowflakeSIvA.calculateCursor(1562244321456127)
});

console.log(nextUUID());
console.log(nextUUID());
console.log(nextUUID.MACHINE_ID);
console.log(Number.isSafeInteger(nextUUID()));

console.time("uuid");

let l: number[] = [];

for (let i = 0; i < 5000; i++) {

    const u = nextUUID();

    if (l.indexOf(u) > -1) {

        console.log(`${u} duplicated.`);
        continue;
    }

    l.push(u);
    console.log(u);
}

console.timeEnd("uuid");

/**
 * Sample output:
 *
 * 1562244260948991 -> 101100011001101101001010110001110011110101111111111
 * 1562244260950015 -> 101100011001101101001010110001110011110111111111111
 * 1562244260951039 -> 101100011001101101001010110001110011111001111111111
 */
