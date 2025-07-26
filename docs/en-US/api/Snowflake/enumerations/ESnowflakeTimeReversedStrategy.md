[Documents for @litert/uuid](../../index.md) / [Snowflake](../index.md) / ESnowflakeTimeReversedStrategy

# Enumeration: ESnowflakeTimeReversedStrategy

Defined in: [Snowflake.ts:21](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L21)

The strategy for handling time reversal events in Snowflake ID generation.

## Enumeration Members

### THROW\_ERROR

> **THROW\_ERROR**: `0`

Defined in: [Snowflake.ts:30](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L30)

Throw an error to stop the generator from generating IDs.

- Pro: Stops ID generation immediately.
- Con: Only after the time catches up the previous time again,
       the generator can continue to generate IDs.

***

### USE\_PREVIOUS\_TIME

> **USE\_PREVIOUS\_TIME**: `2`

Defined in: [Snowflake.ts:49](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L49)

Use the previous time as the current time to generate IDs.

- Pro: Allows the generator to continue generating IDs immediately,
       and the IDs generated will be in the correct order.
- Con: The sequence number will run out quickly if the real time does
       not catch up with the previous time soon.

***

### USE\_REVERSED\_TIME

> **USE\_REVERSED\_TIME**: `1`

Defined in: [Snowflake.ts:39](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L39)

Use the reversed time as the current time to generate IDs.

- Pro: Allows the generator to continue generating IDs immediately.
- Con: The generated IDs may not be in the correct order, and the IDs generated
       may not be unique if the time is reversed multiple times.
