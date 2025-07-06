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

/**
 * The class for generating UUID in version 4.
 */
export class Uuid4Generator {

    /**
     * Generate a UUIDv4 string.
     *
     * @returns A UUIDv4 string.
     */
    public generate(): string {

        const p1 = Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, '0');
        const p2 = (Math.random() * 0x10000 | 0).toString(16).padStart(4, '0');
        const p3 = `4${(Math.random() * 0x1000 | 0).toString(16).padStart(3, '0')}`;
        const p4 = (Math.random() * 0x10000 | 0).toString(16).padStart(4, '0');
        const p5 = (Math.random() * 0x1000000 | 0).toString(16).padStart(6, '0');
        const p6 = (Math.random() * 0x1000000 | 0).toString(16).padStart(6, '0');

        return `${p1}-${p2}-${p3}-${p4}-${p5}${p6}`;
    }
}
