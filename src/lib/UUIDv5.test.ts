import * as NodeTest from 'node:test';
import * as NodeAssert from 'node:assert';
import { Uuid5Generator, EUuid5PredefinedNamespaces } from './UUIDv5';
import { E_INVALID_UUID } from './Errors';

NodeTest.describe('UUIDv5', () => {

    NodeTest.it('the generated UUID must be in version 5', (ct) => {

        const g1 = new Uuid5Generator({
            'namespace': '11111111-0000-5111-2222-444444444444',
        });

        const uuid = g1.generate('hello world');

        NodeAssert.strictEqual(uuid, '3e14c680-789e-59d6-8b37-76bf66395fdf');

        const gUrl = new Uuid5Generator({
            'namespace': EUuid5PredefinedNamespaces.URL,
        });

        NodeAssert.strictEqual(gUrl.generate('https://litert.org'), 'ddb38c05-d542-5e8c-a872-bfdbed38295c');
    });

    NodeTest.it('error should be thrown if namespace is an invalid UUID', (ct) => {

        for (const p of [
            '',
            '12345678-1234-1234-1234-1234567890123',
            '12345678-1234-1234-1234-1234567890',
            '123456789012345678901234567890ZZ'
        ]) {

            NodeAssert.throws(() => {

                new Uuid5Generator({ 'namespace': p });
            }, E_INVALID_UUID);
        }
    });
});
