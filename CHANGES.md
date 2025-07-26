# Changes Logs

## v2.0.3

- fix(algo): reverted the update of `v2.0.2` that removed the reset of sequence number to 0.

- feat(algo): added `onTimeReversed` option to Snowflake (SI) algorithms.

    This option allows the user to specify a strategy for handling time reversals in the Snowflake (SI) algorithm.
    The default strategy is `THROW_ERROR`, to keep the compatibility with previous versions.

- feat(algo): added `onTimeChanged` option to Snowflake (SI) algorithms.

    This option allows the user to customize the behavior of the sequence number, when the time is changed.
    The default strategy is to `RESET` the sequence number to 0, which is compatible with previous versions.

    This option could cooperate with the `sequenceResetThreshold` option, so that only when the current sequence
    number is up to the threshold, the sequence number will be reset to 0.

## ~~v2.0.2~~

- ~~fix(algo): snowflake/snowflake-si class should not reset sequence to 0 avoiding sequence overflow.~~

    ~~To ensure the randomness of the generated IDs, the sequence number must keep increasing even if the time is~~
    ~~changed. Thus an additional counter will be used to track the quantity of IDs generated in the same millisecond.~~

## v2.0.1

- fix(algo): snowflake class constructor should check if `epoch` is invalid.

## v2.0.0

- feat(algo): added implements of GUIDv4 algorithm.
- feat(algo): added implements of GUIDv5 algorithm.
- fix(algo): allow Snowflake using custom epoch.
- fix(algo): implement Snowflake-SI with more customization options.
- deprecate(algo): removed the Snowflake-SI-vA algorithm, which is no longer recommended.
- test(project): added unit tests.
- deprecate(deps): removed all runtime dependencies.

## v1.0.0

- Refactored the project.
- Added implements of standard Snowflake algorithm.

## v0.1.2

- Remove useless dependencies.

## v0.1.1

- Fixed the position of MID of UUID in Snowflake-SI-vA.
