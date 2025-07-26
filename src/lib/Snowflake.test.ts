import * as NodeTest from 'node:test';
import * as NodeAssert from 'node:assert';
import * as Snowflake from './Snowflake';
import * as eL from './Errors';

function testSnowflakeId(
    id: bigint,
    clock: number,
    machineId: number,
    sequence: number,
): void {

    const idBin = id.toString(2).padStart(63, '0');
    NodeAssert.strictEqual(
        idBin.slice(0, -22).padStart(51, '0'),
        clock.toString(2).padStart(51, '0')
    );
    NodeAssert.strictEqual(
        idBin.slice(-22, -12),
        machineId.toString(2).padStart(10, '0')
    );
    NodeAssert.strictEqual(
        idBin.slice(-12),
        sequence.toString(2).padStart(12, '0')
    );
}

NodeTest.describe('Snowflake', () => {

    NodeTest.it('for invalid machine ID, an error should be thrown', () => {

        for (const machineId of [NaN, null, 0.1, -1, 1024, 123456789, Infinity]) {
            NodeAssert.throws(() => {
                new Snowflake.SnowflakeGenerator({ machineId: machineId as number });
            }, eL.E_INVALID_SNOWFLAKE_SETTINGS);
        }
    });

    NodeTest.it('for invalid epoch, an error should be thrown', () => {

        for (const invalidSettings of [
            { machineId: 1, epoch: 1.1, },
            { machineId: 1, epoch: -1.1, },
            { machineId: 1, epoch: -1, },
            { machineId: 1, epoch: NaN, },
            { machineId: 1, epoch: Infinity, },
            { machineId: 1, epoch: '' as unknown as number, },
            { machineId: 1, epoch: [] as unknown as number, },
            { machineId: 1, epoch: Symbol('123') as unknown as number, },
            { machineId: 1, epoch: 9n as unknown as number, },
        ] satisfies Snowflake.ISnowflakeOptions[]) {

            console.log(invalidSettings);
            NodeAssert.throws(() => {
                new Snowflake.SnowflakeGenerator(invalidSettings);
            }, eL.E_INVALID_SNOWFLAKE_SETTINGS);
        }
    });

    NodeTest.it('generate method should work', (ctx) => {

        ctx.mock.timers.enable({ apis: ['Date'], now: 123456789 });
        const g = new Snowflake.SnowflakeGenerator({ machineId: 123 });

        // sequence should start from 0
        const id0 = g.generate();

        testSnowflakeId(id0, 123456789, 123, 0);
    });

    NodeTest.it('generateBy method should work', (ctx) => {

        const g = new Snowflake.SnowflakeGenerator({ machineId: 666 });

        // sequence should start from 0
        const id0 = g.generateBy(12345, 233);

        testSnowflakeId(id0, 12345, 666, 233);

        // Test the X (Twitter) example
        NodeAssert.strictEqual(
            new Snowflake.SnowflakeGenerator({ machineId: 0b0101111010, epoch: 1288834974657 }).generateBy(1656432460105, 0),
            1541815603606036480n
        );
    });

    NodeTest.it('sequence should increase by 1 if time is not changed', (ctx) => {

        ctx.mock.timers.enable({ apis: ['Date'], now: 123456789 });
        const g = new Snowflake.SnowflakeGenerator({ machineId: 123 });

        g.generate();

        testSnowflakeId(g.generate(), 123456789, 123, 1);
    });

    NodeTest.it('sequence should be reset to 0 if time is changed', (ctx) => {

        ctx.mock.timers.enable({ apis: ['Date'], now: 123456789 });
        const g = new Snowflake.SnowflakeGenerator({ machineId: 123 });

        // sequence should start from 0
        g.generate();

        // sequence should increase by 1 if the time is not changed
        const id0 = g.generate().toString(2);

        NodeAssert.strictEqual(id0.slice(-12), (1).toString(2).padStart(12, '0'));

        // sequence should reset to 0 if the time is changed
        ctx.mock.timers.tick(1);

        testSnowflakeId(g.generate(), 123456790, 123, 0);

        ctx.mock.timers.tick(1000);

        testSnowflakeId(g.generate(), 123457790, 123, 0);
    });

    NodeTest.it('error should be thrown if time goes back to the past by default', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g1 = new Snowflake.SnowflakeGenerator({
            machineId: 12,
            epoch: epoch,
        });

        const g2 = new Snowflake.SnowflakeGenerator({
            machineId: 12,
            epoch: epoch,
            onTimeReversed: Snowflake.ESnowflakeTimeReversedStrategy.THROW_ERROR,
        });

        ctx.mock.timers.setTime(epoch + 1000);
        testSnowflakeId(g1.generate(), 1000, 12, 0);
        testSnowflakeId(g2.generate(), 1000, 12, 0);
        ctx.mock.timers.setTime(epoch + 999);

        NodeAssert.throws(() => { g1.generate(); }, eL.E_TIME_REVERSED);
        NodeAssert.throws(() => { g2.generate(); }, eL.E_TIME_REVERSED);
    });

    NodeTest.it('reversed time should be use when using USE_REVERSED_TIME strategy', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g = new Snowflake.SnowflakeGenerator({
            machineId: 12,
            epoch: epoch,
            onTimeReversed: Snowflake.ESnowflakeTimeReversedStrategy.USE_REVERSED_TIME,
        });

        ctx.mock.timers.setTime(epoch + 1000);

        testSnowflakeId(g.generate(), 1000, 12, 0);

        ctx.mock.timers.setTime(epoch + 999);

        testSnowflakeId(g.generate(), 999, 12, 0);
    });

    NodeTest.it('reversed time should be use when using USE_PREVIOUS_TIME strategy', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g = new Snowflake.SnowflakeGenerator({
            machineId: 12,
            epoch: epoch,
            onTimeReversed: Snowflake.ESnowflakeTimeReversedStrategy.USE_PREVIOUS_TIME,
        });

        ctx.mock.timers.setTime(epoch + 1000);

        testSnowflakeId(g.generate(), 1000, 12, 0);

        ctx.mock.timers.setTime(epoch + 999);

        testSnowflakeId(g.generate(), 1000, 12, 1);
    });

    NodeTest.it('error should be thrown if the sequence max out', (ctx) => {

        ctx.mock.timers.enable({ apis: ['Date'], now: 123456789 });
        const g = new Snowflake.SnowflakeGenerator({ machineId: 123 });

        // sequence should start from 0
        for (let i = 0; i < 4096; i++) {
            g.generate();
        }

        NodeAssert.throws(() => { g.generate(); }, eL.E_SEQUENCE_OVERFLOWED);
        NodeAssert.throws(() => { g.generateBy(1234, 4096); }, eL.E_SEQUENCE_OVERFLOWED);
    });

    NodeTest.it('sequence number should be reset to 0 on time changed by default', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g1 = new Snowflake.SnowflakeGenerator({
            machineId: 12,
            epoch: epoch,
        });

        const g2 = new Snowflake.SnowflakeGenerator({
            machineId: 12,
            epoch: epoch,
            onTimeChanged: Snowflake.ESnowflakeSequenceStrategy.RESET,
        });

        testSnowflakeId(g1.generate(), 0, 12, 0);
        testSnowflakeId(g2.generate(), 0, 12, 0);
        testSnowflakeId(g1.generate(), 0, 12, 1);
        testSnowflakeId(g2.generate(), 0, 12, 1);

        ctx.mock.timers.tick(1);

        testSnowflakeId(g1.generate(), 1, 12, 0);
        testSnowflakeId(g2.generate(), 1, 12, 0);
        testSnowflakeId(g1.generate(), 1, 12, 1);
        testSnowflakeId(g2.generate(), 1, 12, 1);
        testSnowflakeId(g1.generate(), 1, 12, 2);
        testSnowflakeId(g2.generate(), 1, 12, 2);

        ctx.mock.timers.tick(1);

        testSnowflakeId(g1.generate(), 2, 12, 0);
        testSnowflakeId(g2.generate(), 2, 12, 0);
    });

    NodeTest.it('sequence number should be reset to 0 on time changed only when reach the threshold', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g = new Snowflake.SnowflakeGenerator({
            machineId: 12,
            epoch: epoch,
            sequenceResetThreshold: 5,
        });

        testSnowflakeId(g.generate(), 0, 12, 0);
        ctx.mock.timers.tick(1);
        testSnowflakeId(g.generate(), 1, 12, 1);
        ctx.mock.timers.tick(1);
        testSnowflakeId(g.generate(), 2, 12, 2);
        ctx.mock.timers.tick(1);
        testSnowflakeId(g.generate(), 3, 12, 3);
        ctx.mock.timers.tick(1);
        testSnowflakeId(g.generate(), 4, 12, 4);
        ctx.mock.timers.tick(1);

        testSnowflakeId(g.generate(), 5, 12, 0);

        testSnowflakeId(g.generate(), 5, 12, 1);
        testSnowflakeId(g.generate(), 5, 12, 2);
        testSnowflakeId(g.generate(), 5, 12, 3);
        testSnowflakeId(g.generate(), 5, 12, 4);
        testSnowflakeId(g.generate(), 5, 12, 5);
        testSnowflakeId(g.generate(), 5, 12, 6);

        ctx.mock.timers.tick(1);

        testSnowflakeId(g.generate(), 6, 12, 0);

        for (const threshold of [
            true, false,
            -1, 4096, 1.1, 0.1, '1', '0.1',
            [], {}, Symbol(''), NaN, Infinity, 123456789n,
        ]) {

            NodeAssert.throws(() => {
                new Snowflake.SnowflakeGenerator({
                    machineId: 12,
                    epoch: epoch,
                    sequenceResetThreshold: threshold as unknown as number,
                });
            });
        }
    });
    
    NodeTest.it('sequence number should not reset if using strategy INCREMENT', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g1 = new Snowflake.SnowflakeGenerator({
            machineId: 12,
            epoch: epoch,
            onTimeChanged: Snowflake.ESnowflakeSequenceStrategy.KEEP_CURRENT,
        });

        testSnowflakeId(g1.generate(), 0, 12, 0);
        testSnowflakeId(g1.generate(), 0, 12, 1);

        ctx.mock.timers.tick(1);

        testSnowflakeId(g1.generate(), 1, 12, 2);
        testSnowflakeId(g1.generate(), 1, 12, 3);

        ctx.mock.timers.tick(1);

        testSnowflakeId(g1.generate(), 2, 12, 4);
    });

    NodeTest.it('sequence number should be able to be updated by custom logic', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g = new Snowflake.SnowflakeGenerator({
            machineId: 12,
            epoch: epoch,
            onTimeChanged: (c) => c > 3n ? 2n : 10n,
        });

        testSnowflakeId(g.generate(), 0, 12, 0);
        testSnowflakeId(g.generate(), 0, 12, 1);
        testSnowflakeId(g.generate(), 0, 12, 2);
        testSnowflakeId(g.generate(), 0, 12, 3);
        // now the next sequence number should be 4

        ctx.mock.timers.tick(1);

        // after 1 tick, the sequence number should be change to 2 because 4 > 3

        testSnowflakeId(g.generate(), 1, 12, 2);

        // now the next sequence number should be 3

        ctx.mock.timers.tick(1);

        // after 1 tick, the sequence number should be change to 10 because !(3 > 3)

        testSnowflakeId(g.generate(), 2, 12, 10);
    });

    NodeTest.it('error should be thrown if current time is before the epoch', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch - 1000 });

        const g = new Snowflake.SnowflakeGenerator({
            machineId: 12,
            epoch: epoch,
        });

        NodeAssert.throws(() => { g.generate(); }, eL.E_TIME_BEFORE_EPOCH);
        NodeAssert.throws(() => { g.generateBy(epoch - 1000, 1); }, eL.E_TIME_BEFORE_EPOCH);
    });
});
