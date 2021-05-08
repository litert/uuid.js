/**
 *  Copyright 2021 Angus.Fenying <fenying@litert.org>
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

import * as $Exception from '@litert/exception';

export const exceptionRegistry = $Exception.createExceptionRegistry({
    module: 'uuid.litert.org',
    types: {
        uuid: {
            index: $Exception.createIncreaseCodeIndex(1)
        }
    }
});

export const E_INVALID_IDC_BIT_WIDTH = exceptionRegistry.register({
    name: 'invalid_idc_bit_width',
    message: 'The bit-width of IDC must be between 0 ~ 10.',
    type: 'uuid',
    metadata: {}
});

export const E_INVALID_MACHINE_BIT_WIDTH = exceptionRegistry.register({
    name: 'invalid_machine_bit_width',
    message: 'The bit-width of machine must be between 0 ~ 10.',
    type: 'uuid',
    metadata: {}
});

export const E_INVALID_WORKER_BIT_WIDTH = exceptionRegistry.register({
    name: 'invalid_worker_bit_width',
    message: 'The bit-width of worker must be between 0 ~ 10.',
    type: 'uuid',
    metadata: {}
});

export const E_INVALID_RADIX_ENCODING = exceptionRegistry.register({
    name: 'invalid_radix_encoding',
    message: 'Radix argument must be an integer between 2 and 36.',
    type: 'uuid',
    metadata: {}
});

export const E_INVALID_IDC_ID = exceptionRegistry.register({
    name: 'invalid_idc_id',
    message: 'The id of IDC is out of range..',
    type: 'uuid',
    metadata: {}
});

export const E_INVALID_MACHINE_ID = exceptionRegistry.register({
    name: 'invalid_machine_id',
    message: 'The id of machine is out of range..',
    type: 'uuid',
    metadata: {}
});

export const E_INVALID_WORKER_ID = exceptionRegistry.register({
    name: 'invalid_worker_id',
    message: 'The id of worker is out of range..',
    type: 'uuid',
    metadata: {}
});

export const E_CLOCK_BACKWARD = exceptionRegistry.register({
    name: 'clock_backward',
    message: 'The clock was moved backwards.',
    type: 'uuid',
    metadata: {}
});

export const E_BIGINT_NOT_SUPPROTED = exceptionRegistry.register({
    name: 'bigint_not_supproted',
    message: 'The BigInt is not supported in current ECMAScript runtime.',
    type: 'uuid',
    metadata: {}
});

export const E_INVALID_UIN_BIT_WIDTH = exceptionRegistry.register({
    name: 'invalid_uin_bit_width',
    message: 'The bit-width of UUID index number is invalid.',
    type: 'uuid',
    metadata: {}
});

export const E_INVALID_BASE_CLOCK = exceptionRegistry.register({
    name: 'invalid_base_clock',
    message: 'The base of clock is invalid, must be after 2003-03-18T07:20:19.224Z.',
    type: 'uuid',
    metadata: {}
});
