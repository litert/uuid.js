[Documents for @litert/uuid](../../index.md) / [SnowflakeSI](../index.md) / ISnowflakeSiOptions

# Interface: ISnowflakeSiOptions

Defined in: [SnowflakeSI.ts:25](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L25)

## Extends

- `Pick`\<[`SnowflakeSiGenerator`](../classes/SnowflakeSiGenerator.md), `"machineId"` \| `"epoch"`\>.`Partial`\<`Pick`\<[`SnowflakeSiGenerator`](../classes/SnowflakeSiGenerator.md), `"machineIdBitWidth"` \| `"clockBitWidth"` \| `"sequenceBitWidth"`\>\>

## Properties

### clockBitWidth?

> `readonly` `optional` **clockBitWidth**: `number`

Defined in: [SnowflakeSI.ts:142](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L142)

The bit width of the clock part.

It must be an integer between 40 and 41.
When 40 is chosen, the epoch must not be earlier than `2003-03-18T07:20:19.225Z` to
keep the clock part within 40 bits (before `2038-01-19T03:14:07Z`).

#### Default

```ts
40
```

#### Inherited from

`Partial.clockBitWidth`

***

### epoch

> `readonly` **epoch**: `number`

Defined in: [SnowflakeSI.ts:113](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L113)

The epoch of the generator.

#### Inherited from

`Pick.epoch`

***

### machineId

> `readonly` **machineId**: `number`

Defined in: [SnowflakeSI.ts:108](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L108)

The identifier of the machine that generates the UUID.

For the SnowflakeSI ID of a specific resource, each generator must use a unique machine ID
so that the generated IDs will not conflict with each other.

The range of the machine ID depends on the `machineIdBitWidth`:

- If `machineIdBitWidth` is 1, the range is [0, 1].
- If `machineIdBitWidth` is 2, the range is [0, 3].
- ...
- If `machineIdBitWidth` is 7, the range is [0, 127].
- If `machineIdBitWidth` is 8, the range is [0, 255].

#### Inherited from

`Pick.machineId`

***

### machineIdBitWidth?

> `readonly` `optional` **machineIdBitWidth**: `number`

Defined in: [SnowflakeSI.ts:122](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L122)

The bit width of the machine ID, must be an integer between 1 and 8.

The sum of `machineIdBitWidth` and `sequenceBitWidth` must be 12.

#### Default

```ts
5
```

#### Inherited from

`Partial.machineIdBitWidth`

***

### onTimeChanged?

> `optional` **onTimeChanged**: [`ESnowflakeSequenceStrategy`](../../Snowflake/enumerations/ESnowflakeSequenceStrategy.md) \| [`ISnowflakeUpdateSequenceOnTimeChanged`](../../Snowflake/type-aliases/ISnowflakeUpdateSequenceOnTimeChanged.md)\<`number`\>

Defined in: [SnowflakeSI.ts:44](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L44)

The strategy for handling the sequence number when the time changes.

This option also accepts a custom function that takes the current sequence number
and returns the new sequence number.

#### Default

```ts
Sf.ESnowflakeSequenceStrategy.RESET
```

***

### onTimeReversed?

> `optional` **onTimeReversed**: [`ESnowflakeTimeReversedStrategy`](../../Snowflake/enumerations/ESnowflakeTimeReversedStrategy.md)

Defined in: [SnowflakeSI.ts:34](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L34)

The strategy for handling time reversal events.

#### Default

```ts
ESnowflakeTimeReversedStrategy.THROW_ERROR
```

***

### sequenceBitWidth?

> `readonly` `optional` **sequenceBitWidth**: `number`

Defined in: [SnowflakeSI.ts:131](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L131)

The bit width of the sequence number, must be an integer between 8 and 11.

The sum of `machineIdBitWidth` and `sequenceBitWidth` must be 12.

#### Default

```ts
7
```

#### Inherited from

`Partial.sequenceBitWidth`

***

### sequenceResetThreshold?

> `optional` **sequenceResetThreshold**: `number`

Defined in: [SnowflakeSI.ts:54](https://github.com/litert/uuid.js/blob/master/src/lib/SnowflakeSI.ts#L54)

When the sequence strategy is set to `ESnowflakeSequenceStrategy.RESET`,
this option specifies the threshold for resetting the sequence number.
So only when the sequence number exceeds this threshold, the sequence number
will be reset to 0.

#### Default

```ts
0
```
