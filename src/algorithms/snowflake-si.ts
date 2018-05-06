export namespace SnowflakeSI {

    export interface UUIDGenerateor {

        (): number;

        readonly MS_CAPACITY: number;

        readonly MACHINE_ID: number;

        readonly BASE_CLOCK: number;
    }

    const DEFAULT_MS_CAPACITY_WIDTH = 8;

    export function createGenerateor(opts: {

        /**
         * The machine ID.
         */
        mid: number;

        /**
         * The base-clock of service.
         */
        baseClock: number;

        uinWidth?: number;

    }): UUIDGenerateor{

        if (!opts.uinWidth) {

            opts.uinWidth = DEFAULT_MS_CAPACITY_WIDTH;
        }

        if (opts.uinWidth > 13 || opts.uinWidth < 1) {

            throw new RangeError("msCapacityWidth must be 1 to 13.");
        }

        const MAX_UIN = Math.pow(2, opts.uinWidth);

        const MAX_MID = Math.pow(2, 13 - opts.uinWidth);

        if (opts.mid >= MAX_MID || opts.mid < 0) {

            throw new RangeError(`mid must be between 0 and ${MAX_MID - 1}.`);
        }

        const BC = opts.baseClock;

        let iter: number = 0;

        let ret: any;

        if (MAX_MID === 1) {

            const MID_FIELD = opts.mid * MAX_UIN;

            ret = function(): number {

                return MID_FIELD + (Date.now() - BC) * 8192 + (iter++ % MAX_UIN);
            };
        }
        else {

            ret = function(): number {

                return (Date.now() - BC) * 8192 + (iter++ % 8192);
            };
        }

        Object.defineProperty(ret, "MS_CAPACITY", {
            value: MAX_UIN,
            writable: false,
            configurable: false
        });

        Object.defineProperty(ret, "BASE_CLOCK", {
            value: opts.baseClock,
            writable: false,
            configurable: false
        });

        Object.defineProperty(ret, "MACHINE_ID", {
            value: opts.mid,
            writable: false,
            configurable: false
        });

        return ret;
    }

}
