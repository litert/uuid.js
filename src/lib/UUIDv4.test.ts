import * as NodeTest from 'node:test';
import * as NodeAssert from 'node:assert';
import { Uuid4Generator } from './UUIDv4';

NodeTest.describe('UUIDv4', () => {

    NodeTest.it('the generated UUID must be in version 4', (ct) => {

        const g = new Uuid4Generator();

        const uuid = g.generate();

        NodeAssert.strictEqual(uuid.length, 36);
        NodeAssert.strictEqual(uuid[14], '4');

        const parts = uuid.split('-');

        NodeAssert.strictEqual(parts.length, 5);

        NodeAssert.strictEqual(parts[0].length, 8);
        NodeAssert.strictEqual(parts[1].length, 4);
        NodeAssert.strictEqual(parts[2].length, 4);
        NodeAssert.strictEqual(parts[3].length, 4);
        NodeAssert.strictEqual(parts[4].length, 12);

        for (let p of parts) {

            NodeAssert.ok(/^[a-f0-9]+$/i.test(p), `Invalid UUID part: ${p}`);
        }
    });
});
