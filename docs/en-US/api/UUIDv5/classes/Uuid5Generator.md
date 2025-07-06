[Documents for @litert/uuid](../../index.md) / [UUIDv5](../index.md) / Uuid5Generator

# Class: Uuid5Generator

Defined in: [UUIDv5.ts:37](https://github.com/litert/uuid.js/blob/master/src/lib/UUIDv5.ts#L37)

The class for generating UUID in version 5.

## Constructors

### Constructor

> **new Uuid5Generator**(`opts`): `Uuid5Generator`

Defined in: [UUIDv5.ts:46](https://github.com/litert/uuid.js/blob/master/src/lib/UUIDv5.ts#L46)

#### Parameters

##### opts

[`IUuid5Options`](../type-aliases/IUuid5Options.md)

#### Returns

`Uuid5Generator`

## Properties

### namespace

> `readonly` **namespace**: `string`

Defined in: [UUIDv5.ts:42](https://github.com/litert/uuid.js/blob/master/src/lib/UUIDv5.ts#L42)

The namespace of the UUID, which must be a UUID

## Methods

### generate()

> **generate**(`name`): `string`

Defined in: [UUIDv5.ts:78](https://github.com/litert/uuid.js/blob/master/src/lib/UUIDv5.ts#L78)

Generate a UUIDv5 based on the namespace and the name.

#### Parameters

##### name

`string`

The name to generate the UUID from.

#### Returns

`string`

A UUIDv5 string.
