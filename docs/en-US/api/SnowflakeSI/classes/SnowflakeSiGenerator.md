[Documents for @litert/uuid](../../index.md) / [SnowflakeSI](../index.md) / SnowflakeSiGenerator

# Class: SnowflakeSiGenerator

Defined in: [SnowflakeSI.ts:75](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L75)

The class for generating Snowflake (Safe-Integer) IDs.

## Constructors

### Constructor

> **new SnowflakeSiGenerator**(`opts`): `SnowflakeSiGenerator`

Defined in: [SnowflakeSI.ts:153](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L153)

#### Parameters

##### opts

[`ISnowflakeSiOptions`](../interfaces/ISnowflakeSiOptions.md)

#### Returns

`SnowflakeSiGenerator`

## Properties

### clockBitWidth

> `readonly` **clockBitWidth**: `number`

Defined in: [SnowflakeSI.ts:136](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L136)

The bit width of the clock part.

It must be an integer between 40 and 41.
When 40 is chosen, the epoch must not be earlier than `2003-03-18T07:20:19.225Z` to
keep the clock part within 40 bits (before `2038-01-19T03:14:07Z`).

#### Default

```ts
40
```

***

### epoch

> `readonly` **epoch**: `number`

Defined in: [SnowflakeSI.ts:107](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L107)

The epoch of the generator.

***

### machineId

> `readonly` **machineId**: `number`

Defined in: [SnowflakeSI.ts:102](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L102)

The identifier of the machine that generates the UUID.

For the SnowflakeSI ID of a specific resource, each generator must use a unique machine ID
so that the generated IDs will not conflict with each other.

The range of the machine ID depends on the `machineIdBitWidth`:

- If `machineIdBitWidth` is 1, the range is [0, 1].
- If `machineIdBitWidth` is 2, the range is [0, 3].
- ...
- If `machineIdBitWidth` is 7, the range is [0, 127].
- If `machineIdBitWidth` is 8, the range is [0, 255].

***

### machineIdBitWidth

> `readonly` **machineIdBitWidth**: `number`

Defined in: [SnowflakeSI.ts:116](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L116)

The bit width of the machine ID, must be an integer between 1 and 8.

The sum of `machineIdBitWidth` and `sequenceBitWidth` must be 12.

#### Default

```ts
5
```

***

### maximumSequence

> `readonly` **maximumSequence**: `number`

Defined in: [SnowflakeSI.ts:143](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L143)

The maximum sequence of the generator, per millisecond.

***

### sequenceBitWidth

> `readonly` **sequenceBitWidth**: `number`

Defined in: [SnowflakeSI.ts:125](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L125)

The bit width of the sequence number, must be an integer between 8 and 11.

The sum of `machineIdBitWidth` and `sequenceBitWidth` must be 12.

#### Default

```ts
7
```

## Methods

### generate()

> **generate**(): `number`

Defined in: [SnowflakeSI.ts:265](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L265)

Generate the next SnowflakeSI ID, based on the current time and the next sequence number.

#### Returns

`number`

A SnowflakeSI ID, which is a 53-bit integer (number type).

#### Throws

If the current time is earlier than the previous time.

#### Throws

If the sequence number exceeds the maximum value.

#### Throws

If the current time is earlier than the epoch.

***

### generateBy()

> **generateBy**(`timestamp`, `sequence`): `number`

Defined in: [SnowflakeSI.ts:332](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L332)

Generate a SnowflakeSI ID by specifying the timestamp and sequence number.

#### Parameters

##### timestamp

`number`

The timestamp to use for the ID, must be greater than or equal to the epoch.

##### sequence

`number`

The sequence number to use for the ID, must be between 0 and the maximum sequence value.

#### Returns

`number`

A SnowflakeSI ID, which is a 53-bit integer (number type).

#### Throws

If the sequence number exceeds the maximum value.

#### Throws

If the timestamp is earlier than the epoch.
