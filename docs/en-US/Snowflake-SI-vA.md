# Snowflake-SI-vA Algorithm

Snowflake-SI-vA algorithm is the variety of Snowflake-SI. The Snowflake-SI uses
an incremental sequence as counter, and uses its lower bits as the UIN. However,
it could still make conflicts when genrating UUIDs in a high-concurrency system
that exceeded the design of system. For this, the Snowflake-SI-vA has been
brought into being.

The Snowflake-SI-vA algorithm uses 53-bits integer as the output of UUID
generation, its bits-mapping shows like following:

| H |   52 ~ 43  |                     42 ~ 0                  | L |
|:-:|:----------:|:-------------------------------------------:|:-:|
|   | 1111111111 | 1111111111111111111111111111111111111111111 |   |
|   |    MID     |                      UIN                    |   |

As above graph shows, the low 43 bits are the UIN(UUID Index Number). It's the
sum of the cursor of an incremental sequence and the current Unix timestamp in
milliseconds. It means the genrated UUID is still an incremental sequence.

> We known, until 2038, the Unix timestamp in milliseconds will only uses a
> 41-bits integer. But, considering the overflow of summing up the cursor of
> incremental sequence and timestamp, there is 2-bits as the extra reserved
> zone.

The high 10-bits is the ID of machine, for distributed services. So that it
will not generate duplicated UUID between multi-instances. Different to the
Snowflake-SI, Snowflake-SI-vA use a fixed 10-bits for MID, and then there could
always be 1024 instances at most.

## Comparing with Snowflake-SI

Here is what Snowflake-SI-vA does better than Snowflake-SI:

- During the same one instance running, it will not generate a duplicated UUID.
- Merged the MAB and UIN, and increase the length of MID.
- There is no more base-clock.

And also some cons:

- Must recalculate the cursor of the incremental sequence by the last generated
  UUID, when initializing the generator.
- Removed the MAB, so that cannot read the generating-time of a UUID from
  itself.

