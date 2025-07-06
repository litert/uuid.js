# LiteRT/UUID

[![Strict TypeScript Checked](https://badgen.net/badge/TS/Strict "Strict TypeScript Checked")](https://www.typescriptlang.org)
[![npm version](https://img.shields.io/npm/v/@litert/uuid.svg?colorB=brightgreen)](https://www.npmjs.com/package/@litert/uuid "Stable Version")
[![License](https://img.shields.io/npm/l/@litert/uuid.svg?maxAge=2592000?style=plastic)](https://github.com/litert/uuid/blob/master/LICENSE)
[![node](https://img.shields.io/node/v/@litert/uuid.svg?colorB=brightgreen)](https://nodejs.org/dist/latest-v8.x/)
[![GitHub issues](https://img.shields.io/github/issues/litert/uuid.js.svg)](https://github.com/litert/uuid.js/issues)
[![GitHub Releases](https://img.shields.io/github/release/litert/uuid.js.svg)](https://github.com/litert/uuid.js/releases "Stable Release")

A uuid generator library for LiteRT framework.

## Requirement

- TypeScript v5.0.0 (or newer)
- Node.js v18.0.0 (or newer)

## Installation

Install by NPM:

```sh
npm i @litert/uuid --save
```

## Documents

- [English](https://litert.org/projects/uuid.js)

## Algorithms

- [Snowflake](https://blog.twitter.com/engineering/en_us/a/2010/announcing-snowflake.html)

    A 64-bit integer UUID algorithm provided by X (Twitter).

- [Snowflake-SI](./docs/en-US/Snowflake-SI.md)

    The Snowflake-SI algorithm generates safe integer (53-bits integer) for
    JavaScript, with capacity 128 uuids per milliseconds, and 64 machine parallel
    working.

- UUIDv4

    The UUID version 4 algorithm generates random UUIDs.

- UUIDv5

    The UUID version 5 algorithm generates UUIDs based on SHA-1 hash of a namespace and a name.

## Examples

- [Snowflake](./src/examples/Snowflake.ts)
- [Snowflake-SI](./src/examples/SnowflakeSI.ts)
- [UUIDv4](./src/examples/UUIDv4.ts)
- [UUIDv5](./src/examples/UUIDv5.ts)

## License

This library is published under [Apache-2.0](./LICENSE) license.
