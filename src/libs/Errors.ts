/**
 *  Copyright 2019 Angus.Fenying <fenying@litert.org>
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

import * as Core from "@litert/core";

export const Errors = Core.createErrorHub("@litert/uuid");

export const E_INVALID_IDC_BIT_WIDTH = Errors.define(
    null,
    "E_INVALID_IDC_BIT_WIDTH",
    "The bit-width of IDC must be between 0 ~ 10."
);

export const E_INVALID_MACHINE_BIT_WIDTH = Errors.define(
    null,
    "E_INVALID_MACHINE_BIT_WIDTH",
    "The bit-width of machine must be between 0 ~ 10."
);

export const E_INVALID_WORKER_BIT_WIDTH = Errors.define(
    null,
    "E_INVALID_WORKER_BIT_WIDTH",
    "The bit-width of worker must be between 0 ~ 10."
);

export const E_INVALID_RADIX_ENCODING = Errors.define(
    null,
    "E_INVALID_RADIX_ENCODING",
    "Radix argument must be an integer between 2 and 36."
);

export const E_INVALID_IDC_ID = Errors.define(
    null,
    "E_INVALID_IDC_ID",
    "The id of IDC is out of range.."
);

export const E_INVALID_MACHINE_ID = Errors.define(
    null,
    "E_INVALID_MACHINE_ID",
    "The id of machine is out of range.."
);

export const E_INVALID_WORKER_ID = Errors.define(
    null,
    "E_INVALID_WORKER_ID",
    "The id of worker is out of range.."
);

export const E_CLOCK_BACKWARD = Errors.define(
    null,
    "E_CLOCK_BACKWARD",
    "The clock was moved backwards."
);

export const E_BIGINT_NOT_SUPPROTED = Errors.define(
    null,
    "E_BIGINT_NOT_SUPPROTED",
    "The BigInt is not supported in current ECMAScript runtime."
);

export const E_INVALID_UIN_BIT_WIDTH = Errors.define(
    null,
    "E_INVALID_UIN_BIT_WIDTH",
    "The bit-width of UUID index number is invalid."
);

export const E_INVALID_BASE_CLOCK = Errors.define(
    null,
    "E_INVALID_BASE_CLOCK",
    "The base of clock is invalid, must be after 2003-03-18T07:20:19.224Z."
);
