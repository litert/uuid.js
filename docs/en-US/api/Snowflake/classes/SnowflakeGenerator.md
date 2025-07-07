[Documents for @litert/uuid](../../index.md) / [Snowflake](../index.md) / SnowflakeGenerator

# Class: SnowflakeGenerator

Defined in: [Snowflake.ts:27](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L27)

The class for generating Snowflake IDs.

## Constructors

### Constructor

> **new SnowflakeGenerator**(`options`): `SnowflakeGenerator`

Defined in: [Snowflake.ts:66](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L66)

#### Parameters

##### options

[`ISnowflakeOptions`](../type-aliases/ISnowflakeOptions.md)

#### Returns

`SnowflakeGenerator`

## Properties

### epoch

> `readonly` **epoch**: `number`

Defined in: [Snowflake.ts:58](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L58)

The epoch of the generator.

The value is recommended to be the time when the service/application goes online.

#### Default

```ts
0
```

***

### machineId

> `readonly` **machineId**: `number`

Defined in: [Snowflake.ts:49](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L49)

The identifier of the machine that generates the UUID.

For the snowflake ID of a specific resource, each generator must use a unique machine ID
so that the generated IDs will not conflict with each other.

#### Range

0 - 1023

***

### MAX\_MACHINE\_ID

> `readonly` `static` **MAX\_MACHINE\_ID**: `1023` = `1023`

Defined in: [Snowflake.ts:39](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L39)

The maximum machine ID that can be used by the generator.

***

### MIN\_MACHINE\_ID

> `readonly` `static` **MIN\_MACHINE\_ID**: `0` = `0`

Defined in: [Snowflake.ts:33](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L33)

The minimum machine ID that can be used by the generator.

## Methods

### generate()

> **generate**(): `bigint`

Defined in: [Snowflake.ts:102](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L102)

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

Defined in: [Snowflake.ts:142](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L142)

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
