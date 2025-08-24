[Documents for @litert/uuid](../../index.md) / [Snowflake](../index.md) / ESnowflakeSequenceStrategy

# Enumeration: ESnowflakeSequenceStrategy

Defined in: [Snowflake.ts:83](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L83)

How should the generator handle the sequence number when the time changes.

## Enumeration Members

### KEEP\_CURRENT

> **KEEP\_CURRENT**: `1`

Defined in: [Snowflake.ts:100](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L100)

Keep the sequence number unchanged when the time changes.

- Pro: The randomness of the IDs will be preserved.
- Con: The sequence number may be reset to 0 if the sequence number overflows,
       so the IDs generated in the same millisecond may not be in the correct order.

***

### RESET

> **RESET**: `0`

Defined in: [Snowflake.ts:91](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L91)

Reset the sequence number to 0 when the time changes.

- Pro: The sequence number will not overflow and the IDs generated will always be in the correct order.
- Con: The randomness of the IDs will be reduced.
