[Documents for @litert/uuid](../../index.md) / [Snowflake](../index.md) / SnowflakeGenerator

# Class: SnowflakeGenerator

Defined in: [Snowflake.ts:134](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L134)

The class for generating Snowflake IDs.

## Constructors

### Constructor

> **new SnowflakeGenerator**(`opts`): `SnowflakeGenerator`

Defined in: [Snowflake.ts:186](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L186)

#### Parameters

##### opts

[`ISnowflakeOptions`](../interfaces/ISnowflakeOptions.md)

#### Returns

`SnowflakeGenerator`

## Properties

### epoch

> `readonly` **epoch**: `number`

Defined in: [Snowflake.ts:176](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L176)

The epoch of the generator.

The value is recommended to be the time when the service/application goes online.

#### Default

```ts
0
```

***

### machineId

> `readonly` **machineId**: `number`

Defined in: [Snowflake.ts:167](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L167)

The identifier of the machine that generates the UUID.

For the snowflake ID of a specific resource, each generator must use a unique machine ID
so that the generated IDs will not conflict with each other.

#### Range

0 - 1023

***

### MAX\_MACHINE\_ID

> `readonly` `static` **MAX\_MACHINE\_ID**: `1023` = `1023`

Defined in: [Snowflake.ts:157](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L157)

The maximum machine ID that can be used by the generator.

***

### MIN\_MACHINE\_ID

> `readonly` `static` **MIN\_MACHINE\_ID**: `0` = `0`

Defined in: [Snowflake.ts:151](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L151)

The minimum machine ID that can be used by the generator.

## Methods

### generate()

> **generate**(): `bigint`

Defined in: [Snowflake.ts:256](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L256)

Generate the next Snowflake ID, based on the current time and the next sequence number.

#### Returns

`bigint`

A Snowflake ID, which is a 64-bit integer (BigInt).

#### Throws

If the current time is earlier than the previous time.

#### Throws

If the sequence number exceeds the maximum value.

#### Throws

If the current time is before the epoch.

***

### generateBy()

> **generateBy**(`timestamp`, `sequence`): `bigint`

Defined in: [Snowflake.ts:323](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L323)

Generate a Snowflake ID by specifying the timestamp and sequence number.

#### Parameters

##### timestamp

`number`

The timestamp to use for the ID.

##### sequence

`number`

The sequence number to use for the ID (0 ~ 4095).

#### Returns

`bigint`

A Snowflake ID, which is a 64-bit integer (BigInt).

#### Throws

If the sequence number exceeds the maximum value.

#### Throws

If the timestamp is before the epoch.
