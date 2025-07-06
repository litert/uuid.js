import * as NodeTest from 'node:test';
import * as NodeAssert from 'node:assert';
import * as Snowflake from './Snowflake';
import * as eL from './Errors';

NodeTest.describe('Snowflake', () => {

    NodeTest.it('for invalid machine ID, an error should be thrown', (ct) => {

        for (const machineId of [NaN, null, 0.1, -1, 1024, 123456789, Infinity]) {
            NodeAssert.throws(() => {
                new Snowflake.SnowflakeGenerator({ machineId: machineId as number });
            }, eL.E_INVALID_MACHINE_ID);
        }
    });

    NodeTest.it('generate method should work', (ctx) => {

        ctx.mock.timers.enable({ apis: ['Date'], now: 123456789 });
        const g = new Snowflake.SnowflakeGenerator({ machineId: 123 });

        // sequence should start from 0
        const id0 = g.generate().toString(2);

        // The bits of [22, 64) must be the timestamp, which is 123456789.
        NodeAssert.strictEqual(id0.slice(0, -22), (123456789).toString(2));
        // The bits of [12, 22) must be the machine ID, which is 123.
        NodeAssert.strictEqual(id0.slice(-22, -12), (123).toString(2).padStart(10, '0'));
        // The bits of [0, 12) must be the sequence, which starts from 0.
        NodeAssert.strictEqual(id0.slice(-12), (0).toString(2).padStart(12, '0'));
    });

    NodeTest.it('generateBy method should work', (ctx) => {

        const g = new Snowflake.SnowflakeGenerator({ machineId: 666 });

        // sequence should start from 0
        const id0 = g.generateBy(12345, 233).toString(2);

        // The bits of [22, 64) must be the timestamp, which is 12345.
        NodeAssert.strictEqual(id0.slice(0, -22), (12345).toString(2));
        // The bits of [12, 22) must be the machine ID, which is 666.
        NodeAssert.strictEqual(id0.slice(-22, -12), (666).toString(2).padStart(10, '0'));
        // The bits of [0, 12) must be the sequence, which is 233.
        NodeAssert.strictEqual(id0.slice(-12), (233).toString(2).padStart(12, '0'));

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

        const id1 = g.generate().toString(2);

        NodeAssert.strictEqual(id1.slice(0, -22), (123456789).toString(2));
        NodeAssert.strictEqual(id1.slice(-22, -12), (123).toString(2).padStart(10, '0'));
        NodeAssert.strictEqual(id1.slice(-12), (1).toString(2).padStart(12, '0'));
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
        const id1 = g.generate().toString(2);

        NodeAssert.strictEqual(id1.slice(0, -22), (123456790).toString(2));
        NodeAssert.strictEqual(id1.slice(-22, -12), (123).toString(2).padStart(10, '0'));
        NodeAssert.strictEqual(id1.slice(-12), (0).toString(2).padStart(12, '0'));

        ctx.mock.timers.tick(1000);

        const id2 = g.generate().toString(2);
        NodeAssert.strictEqual(id2.slice(0, -22), (123457790).toString(2));
        NodeAssert.strictEqual(id2.slice(-22, -12), (123).toString(2).padStart(10, '0'));
        NodeAssert.strictEqual(id2.slice(-12), (0).toString(2).padStart(12, '0'));
    });

    NodeTest.it('error should be thrown if time goes back to the past', (ctx) => {

        ctx.mock.timers.enable({ apis: ['Date'], now: 123456789 });
        const g = new Snowflake.SnowflakeGenerator({ machineId: 123 });

        // sequence should start from 0
        g.generate();

        // move the time to the past
        ctx.mock.timers.setTime(123456788);

        NodeAssert.throws(() => { g.generate(); }, eL.E_TIME_REVERSED);
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
