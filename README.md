# LiteRT/UUID

[![Strict TypeScript Checked](https://badgen.net/badge/TS/Strict "Strict TypeScript Checked")](https://www.typescriptlang.org)
[![npm version](https://img.shields.io/npm/v/@litert/uuid.svg?colorB=brightgreen)](https://www.npmjs.com/package/@litert/uuid "Stable Version")
[![License](https://img.shields.io/npm/l/@litert/uuid.svg?maxAge=2592000?style=plastic)](https://github.com/litert/uuid/blob/master/LICENSE)
[![node](https://img.shields.io/node/v/@litert/uuid.svg?colorB=brightgreen)](https://nodejs.org/dist/latest-v8.x/)
[![GitHub issues](https://img.shields.io/github/issues/litert/uuid.js.svg)](https://github.com/litert/uuid.js/issues)
[![GitHub Releases](https://img.shields.io/github/release/litert/uuid.js.svg)](https://github.com/litert/uuid.js/releases "Stable Release")

A uuid generator library for LiteRT framework.

## Requirement

- TypeScript v2.7.1 (or newer)
- Node.js v7.0.0 (or newer)

## Installation

Install by NPM:

```sh
npm i @litert/uuid --save
```

## Algorithms

Following algorithms are supported:

### [Snowflake](https://blog.twitter.com/engineering/en_us/a/2010/announcing-snowflake.html)

A 64-bit integer UUID algorithm provided by Twitter.

### [Snowflake-SI](./docs/en-US/Snowflake-SI.md)

The Snowflake-SI algorithm generates safe integer (52-bits integer) for
JavaScript, with capacity 128 uuids per milliseconds, and 64 machine parallel
working.

### [Snowflake-SI-vA](./docs/en-US/Snowflake-SI-vA.md)

A variant of Snowflake-SI algorithm.

## Samples

### Snowflake-SI Usage

```ts
import * as libuuid from "@litert/uuid";

const factory = UUID.SnowflakeBI.createFactory();

const makeUUID = factory.create({

    /**
     * The machine ID.
     *
     * By default the uinBitWidth is 8, and the rest 5 bits is left to MID, so
     * that the mid must be between 0 and 31.
     */
    "machineId": 1,

    /**
     * The base-clock of generator. Is unchangeable once setup.
     *
     * And it cannot be earlier than 2003-03-18T07:20:19.225Z.
     */
    "baseClock": new Date(2004, 0, 1, 0, 0, 0, 0).getTime(),
});

console.log(makeUUID());                    // Generate a UUID
console.log(makeUUID());                    // Generate a UUID
console.log(makeUUID.uinCapacity);          // See the capacity of UUIDs in 1ms
console.log(makeUUID.machineId);            // See the machine ID.
console.log(new Date(makeUUID.baseClock));  // See the base-clock
```

### Snowflake-SI Adjustment

```ts
import * as libuuid from "@litert/uuid";

const factory = UUID.SnowflakeBI.createFactory();

const makeUUID = factory.create({

    /**
     * The machine ID.
     *
     * Now the uinBitWidth has been set to 12, and only 1 bit is left to MID, so
     * that the mid can be either 1 or 0.
     */
    "mid": 1,

    /**
     * The base-clock of generator. Is unchangeable once setup.
     *
     * And it cannot be earlier than 2003-03-18T07:20:20Z
     */
    "baseClock": new Date(2004, 0, 1, 0, 0, 0, 0).getTime(),

    /**
     * The bit-width of UIN.
     */
    "uinBitWidth": 12
});

console.log(makeUUID());                    // Generate a UUID
console.log(makeUUID());                    // Generate a UUID
console.log(makeUUID.uinCapacity);          // See the capacity of UUIDs in 1ms
console.log(makeUUID.machineId);            // See the machine ID.
console.log(new Date(makeUUID.baseClock));  // See the base-clock
```

### Snowflake-SI-vA Usage

```ts
import * as libuuid from "@litert/uuid";

const factory = UUID.SnowflakeBIvA.createFactory();

const makeUUID = factory.create({

    /**
     * The ID of machine, 0 ~ 1023
     */
    "machineId": 333,

    /**
     * Calculate the cursor of the incremental sequence insides generator by
     * the last generated UUID.
     */
    "cursor": factory.calculateCursor(1562244321456127)
});

console.log(nextUUID());
console.log(nextUUID());
console.log(nextUUID.machineId);
console.log(Number.isSafeInteger(nextUUID()));

```

## License

This library is published under [Apache-2.0](./LICENSE) license.
