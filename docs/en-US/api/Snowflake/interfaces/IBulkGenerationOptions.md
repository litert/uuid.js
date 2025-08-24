[Documents for @litert/uuid](../../index.md) / [Snowflake](../index.md) / IBulkGenerationOptions

# Interface: IBulkGenerationOptions

Defined in: [Snowflake.ts:22](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L22)

The options for bulk generation of snowflake IDs.

## Properties

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [Snowflake.ts:31](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L31)

The maximum number of sequential retries for generating IDs in bulk.

If the failures exceeded this limit, the original error will be thrown.

#### Default

```ts
3
```

***

### retryDelayMs?

> `optional` **retryDelayMs**: `number`

Defined in: [Snowflake.ts:38](https://github.com/litert/uuid.js/blob/master/src/lib/Snowflake.ts#L38)

The delay between each retry attempt in milliseconds.

#### Default

```ts
1
```
