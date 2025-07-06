/**
 *  Copyright 2025 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import * as NodeCrypto from 'node:crypto';
import * as eL from './Errors';

/**
 * The options for the UUIDv5 generator.
 */
export type IUuid5Options = Pick<Uuid5Generator, 'namespace'>;

/**
 * The pre-defined namespaces for UUIDv5.
 */
export enum EUuid5PredefinedNamespaces {
    DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
    OID = '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
    X500 = '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
}

/**
 * The class for generating UUID in version 5.
 */
export class Uuid5Generator {

    /**
     * The namespace of the UUID, which must be a UUID
     */
    public readonly namespace: string;

    private readonly _nsBin: Buffer;

    public constructor(opts: IUuid5Options) {

        this.namespace = opts.namespace;
        this._nsBin = this._uuidString2Buffer(opts.namespace);
    }

    private _uuidString2Buffer(uuid: string): Buffer {

        uuid = uuid.replace(/-/g, '');

        if (uuid.length !== 32) {

            throw new eL.E_INVALID_UUID({ uuid });
        }

        const ret = Buffer.from(uuid, 'hex');

        if (ret.length !== 16) {

            throw new eL.E_INVALID_UUID({ uuid });
        }

        return ret;
    }

    /**
     * Generate a UUIDv5 based on the namespace and the name.
     *
     * @param name  The name to generate the UUID from.
     *
     * @returns A UUIDv5 string.
     */
    public generate(name: string): string {

        const hash = NodeCrypto.createHash('sha1').update(this._nsBin).update(name).digest();

        hash[6] = (hash[6] & 0x0f) | 0x50; // the version, set to v5 (0101)
        hash[8] = (hash[8] & 0x3f) | 0x80; // clock_seq_hi_and_reserved, set to 10

        const hex = hash.toString('hex');

        return [
            hex.slice(0, 8),
            hex.slice(8, 12),
            hex.slice(12, 16),
            hex.slice(16, 20),
            hex.slice(20, 32),
            // drop the last 2 bytes
        ].join('-');
    }
}
