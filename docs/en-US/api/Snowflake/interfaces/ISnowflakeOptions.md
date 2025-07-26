[Documents for @litert/uuid](../../index.md) / [Snowflake](../index.md) / ISnowflakeOptions

# Interface: ISnowflakeOptions

Defined in: [Snowflake.ts:83](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L83)

The options for the standard Snowflake ID generator.

## Extends

- `Pick`\<[`SnowflakeGenerator`](../classes/SnowflakeGenerator.md), `"machineId"`\>.`Partial`\<`Pick`\<[`SnowflakeGenerator`](../classes/SnowflakeGenerator.md), `"epoch"`\>\>

## Properties

### epoch?

> `readonly` `optional` **epoch**: `number`

Defined in: [Snowflake.ts:176](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L176)

The epoch of the generator.

The value is recommended to be the time when the service/application goes online.

#### Default

```ts
0
```

#### Inherited from

`Partial.epoch`

***

### machineId

> `readonly` **machineId**: `number`

Defined in: [Snowflake.ts:167](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L167)

The identifier of the machine that generates the UUID.

For the snowflake ID of a specific resource, each generator must use a unique machine ID
so that the generated IDs will not conflict with each other.

#### Range

0 - 1023

#### Inherited from

`Pick.machineId`

***

### onTimeChanged?

> `optional` **onTimeChanged**: [`ESnowflakeSequenceStrategy`](../enumerations/ESnowflakeSequenceStrategy.md) \| [`ISnowflakeUpdateSequenceOnTimeChanged`](../type-aliases/ISnowflakeUpdateSequenceOnTimeChanged.md)\<`bigint`\>

Defined in: [Snowflake.ts:101](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L101)

The strategy for handling the sequence number when the time changes.

This option also accepts a custom function that takes the current sequence number
and returns the new sequence number.

#### Default

```ts
ESnowflakeSequenceStrategy.RESET
```

***

### onTimeReversed?

> `optional` **onTimeReversed**: [`ESnowflakeTimeReversedStrategy`](../enumerations/ESnowflakeTimeReversedStrategy.md)

Defined in: [Snowflake.ts:91](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L91)

The strategy for handling time reversal events.

#### Default

```ts
ESnowflakeTimeReversedStrategy.THROW_ERROR
```

***

### sequenceResetThreshold?

> `optional` **sequenceResetThreshold**: `number`

Defined in: [Snowflake.ts:111](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L111)

When the sequence strategy is set to `ESnowflakeSequenceStrategy.RESET`,
this option specifies the threshold for resetting the sequence number.
So only when the sequence number exceeds this threshold, the sequence number
will be reset to 0.

#### Default

```ts
0
```
