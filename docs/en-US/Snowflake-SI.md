# Snowflake-SI Algorithm

Snowflake-SI algorithm is a variety of Twitter's snowflake algorithm.
The standard snowflake uses a 64-bits integer as output. However, the ECMAScript
does not provides the supports of 64-bits integer. It's language standard shows
that only integers between `-Number.MAX_SAFE_INTEGER` and 
`+Number.MAX_SAFE_INTEGER`(including both points), are accurate, which means
only 53-bits integer can be used in ECMAScript.

The Snowflake-SI algorithm uses 53-bits integer as the output of UUID
generation, its bits-mapping shows like following:

| H |                  52 ~ 13                 | 12 ~ 8 |   7 ~ 0  | L |
|:-:|:----------------------------------------:|:------:|:--------:|:-:|
|   | 1111111111111111111111111111111111111111 | 11111  | 11111111 |   |
|   |                   MAB                    |  MID   |   UIN    |   |

As the graph, the low 8-bits is the UIN(UUID index number), which is the low 
8-bits of an incremental-sequence. Thus, even if there is 256 generation in one
millisecond, none of the generated UUID will be duplicated.

> Theoretically, a single Node.js process can not handle 256 requests with
> logical IO operation. So that the capacity 256 UUIDs per millisecond can
> meet most of the cases. If 256 is not enough, please read the next section
> to adjust the algoritm.

The bits 8 ~ 12 are the MID (Machine ID), for distributed services. So that it
will not generate duplicated UUID between multi-instances. Snowflake-SI use
5-bits for MID, so that there could be 32 instances at most.

The high 40-bits is the MAB (Milliseconds after base-clock). Before using the
Snowflake-SI algorithm, a base-clock must be determined, which is the base to
start time of using the UUID generation. The MAB is the number of milliseconds
after the base-clock. To avoid generating duplicated UUID, the MAB must be an
incremental sequence, and then the base-clock is unchangeable after it's
determined.

> According to the max time that UNIX timestamp can represent is
> `2038-01-19T03:14:07Z`, `0x7FFFFFFF`, and `2147483647000` in milliseconds.
> It's a 41-bits integer, but the MAB must be a 40-bits integer. That's why
> it uses MAB instead of timestamp. And, for this, the base-clock must meet
> a condition that `2147483647000 - BaseClock < Math.pow(2, 40)`. It means
> `BaseClock > 1047972019224`, while `1047972019224` stand for 
> `2003-03-18T07:20:19.224Z`.

## Algoritm Adjustment

As above said, the high 40-bits is fixed, but the rest 13-bits is adjustable.
That means if distributed deployment is not necessary, the MID is avoidable,
so the whole 13-bits can be use as the UIN, while its capacity is upto 8192
