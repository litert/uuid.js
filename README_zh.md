# LiteRT/UUID

[![Strict TypeScript Checked](https://badgen.net/badge/TS/Strict "Strict TypeScript Checked")](https://www.typescriptlang.org)
[![npm version](https://img.shields.io/npm/v/@litert/uuid.svg?colorB=brightgreen)](https://www.npmjs.com/package/@litert/uuid "Stable Version")
[![License](https://img.shields.io/npm/l/@litert/uuid.svg?maxAge=2592000?style=plastic)](https://github.com/litert/uuid/blob/master/LICENSE)
[![node](https://img.shields.io/node/v/@litert/uuid.svg?colorB=brightgreen)](https://nodejs.org/dist/latest-v8.x/)
[![GitHub issues](https://img.shields.io/github/issues/litert/uuid.js.svg)](https://github.com/litert/uuid.js/issues)
[![GitHub Releases](https://img.shields.io/github/release/litert/uuid.js.svg)](https://github.com/litert/uuid.js/releases "Stable Release")

一个简单的 UUID 生成器工具库。

## 使用要求

- TypeScript v5.0.0 (or newer)
- Node.js v18.0.0 (or newer)

## 安装

通过 NPM 安装：

```sh
npm i @litert/uuid --save
```

## 文档

- [English](https://litert.org/projects/uuid.js)

## 生成算法

目前支持以下生成算法。

- [Snowflake](https://blog.twitter.com/engineering/en_us/a/2010/announcing-snowflake.html)

    一种 X (Twitter) 发明的 64 位整数 UUID 生成算法。

- [Snowflake-SI](./docs/zh-CN/Snowflake-SI.md)

    Snowflake-SI 是 Snowflake Safe Integer 的简写，即是 Snowflake 算法的简版，但是能
    保证生成的是 ECMAScript 规范中的安全整数（0 ~ 2 ^ 54 - 1）

- UUIDv4

    UUIDv4 是一种基于随机数生成的 UUID 生成算法。

- UUIDv5

    UUIDv5 是一种基于 SHA-1 哈希算法的 UUID 生成算法，使用命名空间和名称作为输入。

## 示例

- [Snowflake](./src/examples/Snowflake.ts)
- [Snowflake-SI](./src/examples/SnowflakeSI.ts)
- [UUIDv4](./src/examples/UUIDv4.ts)
- [UUIDv5](./src/examples/UUIDv5.ts)

## 开源许可

该项目基于 [Apache-2.0](./LICENSE) 开源协议授权。
