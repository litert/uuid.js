import * as NodeTest from 'node:test';
import * as NodeAssert from 'node:assert';
import * as SnowflakeSI from './SnowflakeSI';
import * as Snowflake from './Snowflake';
import * as eL from './Errors';

function testSnowflakeId(
    generator: SnowflakeSI.SnowflakeSiGenerator,
    id: number,
    clock: number,
    machineId: number,
    sequence: number,
): void {

    const idBin = id.toString(2).padStart(53, '0');
    NodeAssert.strictEqual(
        idBin.slice(0, generator.clockBitWidth),
        clock.toString(2).padStart(generator.clockBitWidth, '0')
    );
    NodeAssert.strictEqual(
        idBin.slice(generator.clockBitWidth, generator.clockBitWidth + generator.machineIdBitWidth),
        machineId.toString(2).padStart(generator.machineIdBitWidth, '0')
    );
    NodeAssert.strictEqual(
        idBin.slice(-generator.sequenceBitWidth),
        sequence.toString(2).padStart(generator.sequenceBitWidth, '0')
    );
}

NodeTest.describe('Snowflake SI', () => {

    NodeTest.it('for invalid machine ID, an error should be thrown', (ct) => {

        for (const machineId of [NaN, null, 0.1, -1, 1024, 123456789, Infinity]) {
            NodeAssert.throws(() => {
                new SnowflakeSI.SnowflakeSiGenerator({
                    machineId: machineId as number,
                    epoch: Date.parse('2023-11-11 11:11:11'),
                    machineIdBitWidth: 5,
                });
            }, eL.E_INVALID_SNOWFLAKE_SETTINGS);
        }
    });

    NodeTest.it('for invalid machine ID bit width, an error should be thrown', (ct) => {

        const OK_EPOCH = Date.parse('2023-11-11 11:11:11');

        for (const invalidSettings of [
            { machineId: 111111, epoch: OK_EPOCH, machineIdBitWidth: 5, clockBitWidth: 41 },
            { machineId: 1, epoch: OK_EPOCH, machineIdBitWidth: 0, clockBitWidth: 41 },
            { machineId: 1, epoch: OK_EPOCH, sequenceBitWidth: 0, clockBitWidth: 41 },
            { machineId: 1, epoch: OK_EPOCH, machineIdBitWidth: 12, clockBitWidth: 41 },
            { machineId: 1, epoch: OK_EPOCH, sequenceBitWidth: 12, clockBitWidth: 41 },
            { machineId: 1, epoch: OK_EPOCH, machineIdBitWidth: 13, clockBitWidth: 40 },
            { machineId: 1, epoch: OK_EPOCH, sequenceBitWidth: 13, clockBitWidth: 40 },
            { machineId: 1, epoch: 12345, clockBitWidth: 40 },
        ] satisfies SnowflakeSI.ISnowflakeSiOptions[]) {

            NodeAssert.throws(() => {
                new SnowflakeSI.SnowflakeSiGenerator(invalidSettings);
            }, eL.E_INVALID_SNOWFLAKE_SETTINGS);
        }
    });

    NodeTest.it('for invalid epoch, an error should be thrown', (ct) => {

        for (const invalidSettings of [
            { machineId: 1, epoch: 1.1, machineIdBitWidth: 5, clockBitWidth: 41 },
            { machineId: 1, epoch: -1.1, machineIdBitWidth: 5, clockBitWidth: 41 },
            { machineId: 1, epoch: -1, machineIdBitWidth: 5, clockBitWidth: 41 },
            { machineId: 1, epoch: NaN, machineIdBitWidth: 5, clockBitWidth: 41 },
            { machineId: 1, epoch: Infinity, machineIdBitWidth: 5, clockBitWidth: 41 },
            { machineId: 1, epoch: '' as unknown as number, machineIdBitWidth: 5, clockBitWidth: 41 },
            { machineId: 1, epoch: [] as unknown as number, machineIdBitWidth: 5, clockBitWidth: 41 },
            { machineId: 1, epoch: {} as unknown as number, machineIdBitWidth: 5, clockBitWidth: 41 },
            { machineId: 1, epoch: 1n as unknown as number, machineIdBitWidth: 5, clockBitWidth: 41 },
            { machineId: 1, epoch: Symbol('') as unknown as number, machineIdBitWidth: 5, clockBitWidth: 41 },
        ] satisfies SnowflakeSI.ISnowflakeSiOptions[]) {

            NodeAssert.throws(() => {
                new SnowflakeSI.SnowflakeSiGenerator(invalidSettings);
            }, eL.E_INVALID_SNOWFLAKE_SETTINGS);
        }
    });

    NodeTest.it('generate method should work', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        const NOW = Date.parse('2024-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: NOW });

        for (let i = 1; i <= 8; i++) {

            for (const cbw of [40, 41]) {

                const g = new SnowflakeSI.SnowflakeSiGenerator({
                    machineId: 1,
                    epoch: epoch,
                    machineIdBitWidth: i,
                    clockBitWidth: cbw,
                });

                // sequence should start from 0
                const lbw = 53 - g.clockBitWidth;
                NodeAssert.strictEqual(g.clockBitWidth, cbw);
                NodeAssert.strictEqual(g.machineIdBitWidth, i);
                NodeAssert.strictEqual(g.sequenceBitWidth, lbw - i);

                testSnowflakeId(g, g.generate(), NOW - epoch, 1, 0);
            }
        }
    });

    NodeTest.it('generateBy method should work', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        const g = new SnowflakeSI.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
        });

        // sequence should start from 0
        testSnowflakeId(g, g.generateBy(epoch + 1234567, 55), 1234567, 12, 55);
    });

    NodeTest.it('sequence should increase by 1 if time is not changed', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g = new SnowflakeSI.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
        });

        ctx.mock.timers.tick(123456789);

        g.generate();

        testSnowflakeId(g, g.generate(), 123456789, 12, 1);
    });

    NodeTest.it('sequence should be reset to 0 if time is changed', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g = new SnowflakeSI.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
        });

        ctx.mock.timers.tick(123456789);

        // sequence should start from 0
        g.generate();

        testSnowflakeId(g, g.generate(), 123456789, 12, 1);

        // sequence should reset to 0 if the time is changed
        ctx.mock.timers.tick(1);
        testSnowflakeId(g, g.generate(), 123456790, 12, 0);

        ctx.mock.timers.tick(1000);
        testSnowflakeId(g, g.generate(), 123457790, 12, 0);
        testSnowflakeId(g, g.generate(), 123457790, 12, 1);
        testSnowflakeId(g, g.generate(), 123457790, 12, 2);
    });

    NodeTest.it('error should be thrown if time goes back to the past by default', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g1 = new SnowflakeSI.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
        });

        const g2 = new SnowflakeSI.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
            onTimeReversed: Snowflake.ESnowflakeTimeReversedStrategy.THROW_ERROR,
        });

        ctx.mock.timers.setTime(epoch + 1000);
        testSnowflakeId(g1, g1.generate(), 1000, 12, 0);
        testSnowflakeId(g2, g2.generate(), 1000, 12, 0);
        ctx.mock.timers.setTime(epoch + 999);

        NodeAssert.throws(() => { g1.generate(); }, eL.E_TIME_REVERSED);
        NodeAssert.throws(() => { g2.generate(); }, eL.E_TIME_REVERSED);
    });

    NodeTest.it('reversed time should be use when using USE_REVERSED_TIME strategy', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g = new SnowflakeSI.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
            onTimeReversed: Snowflake.ESnowflakeTimeReversedStrategy.USE_REVERSED_TIME,
        });

        ctx.mock.timers.setTime(epoch + 1000);

        testSnowflakeId(g, g.generate(), 1000, 12, 0);

        ctx.mock.timers.setTime(epoch + 999);

        testSnowflakeId(g, g.generate(), 999, 12, 0);
    });

    NodeTest.it('reversed time should be use when using USE_PREVIOUS_TIME strategy', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g = new SnowflakeSI.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
            onTimeReversed: Snowflake.ESnowflakeTimeReversedStrategy.USE_PREVIOUS_TIME,
        });

        ctx.mock.timers.setTime(epoch + 1000);

        testSnowflakeId(g, g.generate(), 1000, 12, 0);

        ctx.mock.timers.setTime(epoch + 999);

        testSnowflakeId(g, g.generate(), 1000, 12, 1);
    });

    NodeTest.it('error should be thrown if the sequence max out', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g = new SnowflakeSI.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
        });

        NodeAssert.strictEqual(g.maximumSequence, (1 << g.sequenceBitWidth) - 1);

        // sequence should start from 0
        for (let i = 0; i <= g.maximumSequence; i++) {
            g.generate();
        }

        NodeAssert.throws(() => { g.generate(); }, eL.E_SEQUENCE_OVERFLOWED);
    });

    NodeTest.it('sequence number should be reset to 0 on time changed by default', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g1 = new SnowflakeSI.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
        });

        const g2 = new SnowflakeSI.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
            onTimeChanged: Snowflake.ESnowflakeSequenceStrategy.RESET,
        });

        testSnowflakeId(g1, g1.generate(), 0, 12, 0);
        testSnowflakeId(g2, g2.generate(), 0, 12, 0);
        testSnowflakeId(g1, g1.generate(), 0, 12, 1);
        testSnowflakeId(g2, g2.generate(), 0, 12, 1);

        ctx.mock.timers.tick(1);

        testSnowflakeId(g1, g1.generate(), 1, 12, 0);
        testSnowflakeId(g2, g2.generate(), 1, 12, 0);
        testSnowflakeId(g1, g1.generate(), 1, 12, 1);
        testSnowflakeId(g2, g2.generate(), 1, 12, 1);
        testSnowflakeId(g1, g1.generate(), 1, 12, 2);
        testSnowflakeId(g2, g2.generate(), 1, 12, 2);

        ctx.mock.timers.tick(1);

        testSnowflakeId(g1, g1.generate(), 2, 12, 0);
        testSnowflakeId(g2, g2.generate(), 2, 12, 0);
    });

    NodeTest.it('sequence number should be reset to 0 on time changed only when reach the threshold', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g1 = new SnowflakeSI.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
            sequenceResetThreshold: 5,
        });

        testSnowflakeId(g1, g1.generate(), 0, 12, 0);
        ctx.mock.timers.tick(1);
        testSnowflakeId(g1, g1.generate(), 1, 12, 1);
        ctx.mock.timers.tick(1);
        testSnowflakeId(g1, g1.generate(), 2, 12, 2);
        ctx.mock.timers.tick(1);
        testSnowflakeId(g1, g1.generate(), 3, 12, 3);
        ctx.mock.timers.tick(1);
        testSnowflakeId(g1, g1.generate(), 4, 12, 4);
        ctx.mock.timers.tick(1);

        testSnowflakeId(g1, g1.generate(), 5, 12, 0);

        testSnowflakeId(g1, g1.generate(), 5, 12, 1);
        testSnowflakeId(g1, g1.generate(), 5, 12, 2);
        testSnowflakeId(g1, g1.generate(), 5, 12, 3);
        testSnowflakeId(g1, g1.generate(), 5, 12, 4);
        testSnowflakeId(g1, g1.generate(), 5, 12, 5);
        testSnowflakeId(g1, g1.generate(), 5, 12, 6);

        ctx.mock.timers.tick(1);

        testSnowflakeId(g1, g1.generate(), 6, 12, 0);

        for (const threshold of [
            true, false,
            -1, g1.maximumSequence + 1, 1.1, 0.1, '1', '0.1',
            [], {}, Symbol(''), NaN, Infinity, 123456789n,
        ]) {

            NodeAssert.throws(() => {
                new SnowflakeSI.SnowflakeSiGenerator({
                    machineId: 12,
                    epoch: epoch,
                    machineIdBitWidth: 4,
                    sequenceResetThreshold: threshold as unknown as number,
                });
            });
        }
    });

    NodeTest.it('sequence number should not reset if using strategy INCREMENT', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g1 = new SnowflakeSI.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
            onTimeChanged: Snowflake.ESnowflakeSequenceStrategy.KEEP_CURRENT,
        });

        testSnowflakeId(g1, g1.generate(), 0, 12, 0);
        testSnowflakeId(g1, g1.generate(), 0, 12, 1);

        ctx.mock.timers.tick(1);

        testSnowflakeId(g1, g1.generate(), 1, 12, 2);
        testSnowflakeId(g1, g1.generate(), 1, 12, 3);

        ctx.mock.timers.tick(1);

        testSnowflakeId(g1, g1.generate(), 2, 12, 4);
    });

    NodeTest.it('sequence number should be able to be updated by custom logic', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g = new SnowflakeSI.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
            onTimeChanged: (c) => c > 3 ? 2 : 10,
        });

        testSnowflakeId(g, g.generate(), 0, 12, 0);
        testSnowflakeId(g, g.generate(), 0, 12, 1);
        testSnowflakeId(g, g.generate(), 0, 12, 2);
        testSnowflakeId(g, g.generate(), 0, 12, 3);
        // now the next sequence number should be 4

        ctx.mock.timers.tick(1);

        // after 1 tick, the sequence number should be change to 2 because 4 > 3

        testSnowflakeId(g, g.generate(), 1, 12, 2);

        // now the next sequence number should be 3

        ctx.mock.timers.tick(1);

        // after 1 tick, the sequence number should be change to 10 because !(3 > 3)

        testSnowflakeId(g, g.generate(), 2, 12, 10);
    });

    NodeTest.it('error should be thrown if the sequence max out', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g = new SnowflakeSI.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
        });

        // sequence should start from 0
        for (let i = 0; i <= g.maximumSequence; i++) {
            g.generate();
        }

        NodeAssert.throws(() => { g.generate(); }, eL.E_SEQUENCE_OVERFLOWED);
        NodeAssert.throws(() => { g.generateBy(epoch + 1000, g.maximumSequence + 1); }, eL.E_SEQUENCE_OVERFLOWED);
    });

    NodeTest.it('error should be thrown if current time is before the epoch', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch - 1000 });

        const g = new SnowflakeSI.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
        });

        NodeAssert.throws(() => { g.generate(); }, eL.E_TIME_BEFORE_EPOCH);
        NodeAssert.throws(() => { g.generateBy(epoch - 1000, 1); }, eL.E_TIME_BEFORE_EPOCH);
    });
});
