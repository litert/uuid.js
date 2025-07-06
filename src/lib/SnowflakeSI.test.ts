import * as NodeTest from 'node:test';
import * as NodeAssert from 'node:assert';
import * as Snowflake from './SnowflakeSI';
import * as eL from './Errors';

function testSnowflakeId(
    generator: Snowflake.SnowflakeSiGenerator,
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
                new Snowflake.SnowflakeSiGenerator({
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
        ] satisfies Snowflake.ISnowflakeSiOptions[]) {

            NodeAssert.throws(() => {
                new Snowflake.SnowflakeSiGenerator(invalidSettings);
            }, eL.E_INVALID_SNOWFLAKE_SETTINGS);
        }
    });

    NodeTest.it('generate method should work', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        const NOW = Date.parse('2024-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: NOW });

        for (let i = 1; i <= 8; i++) {

            for (const cbw of [40, 41]) {

                const g = new Snowflake.SnowflakeSiGenerator({
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

        const g = new Snowflake.SnowflakeSiGenerator({
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

        const g = new Snowflake.SnowflakeSiGenerator({
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

        const g = new Snowflake.SnowflakeSiGenerator({
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

    NodeTest.it('error should be thrown if time goes back to the past', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g = new Snowflake.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
        });

        ctx.mock.timers.setTime(epoch + 1000);
        g.generate();
        ctx.mock.timers.setTime(epoch + 999);

        NodeAssert.throws(() => { g.generate(); }, eL.E_TIME_REVERSED);
    });

    NodeTest.it('error should be thrown if the sequence max out', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g = new Snowflake.SnowflakeSiGenerator({
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

    NodeTest.it('error should be thrown if the sequence max out', (ctx) => {

        const epoch = Date.parse('2023-11-11 22:22:22');

        ctx.mock.timers.enable({ apis: ['Date'], now: epoch });

        const g = new Snowflake.SnowflakeSiGenerator({
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

        const g = new Snowflake.SnowflakeSiGenerator({
            machineId: 12,
            epoch: epoch,
            machineIdBitWidth: 4,
        });

        NodeAssert.throws(() => { g.generate(); }, eL.E_TIME_BEFORE_EPOCH);
        NodeAssert.throws(() => { g.generateBy(epoch - 1000, 1); }, eL.E_TIME_BEFORE_EPOCH);
    });
});
