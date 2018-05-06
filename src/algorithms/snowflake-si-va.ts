export namespace SnowflakeSIvA {

    export interface UUIDGenerateor {

        (): number;

        readonly MACHINE_ID: number;
    }

    /**
     * Machine ID
     */
    const MID_LENGTH = 10;

    export function calculateCursor(lastUUID: number): number {

        const result = Math.floor(
            lastUUID / Math.pow(2, MID_LENGTH)
        ) - Date.now();

        if (result >= 0) {

            return result + 1;
        }

        return 0;
    }

    export function createGenerateor(opts: {

        /**
         * The machine ID.
         */
        mid: number;

        /**
         * The cursor of the incremental sequence.
         *
         * Default: 0
         */
        cursor?: number;

    }): UUIDGenerateor{

        const MAX_MID = Math.pow(2, MID_LENGTH);

        if (opts.mid >= MAX_MID || opts.mid < 0) {

            throw new RangeError(`mid must be between 0 and ${MAX_MID - 1}.`);
        }

        let cursor: number = opts.cursor || 0;

        let ret: any;

        const MID_FIELD = opts.mid;

        const UIN_BASE = Math.pow(2, MID_LENGTH);

        ret = function(): number {

            return MID_FIELD + (Date.now() + cursor++) * UIN_BASE;
        };

        Object.defineProperty(ret, "MACHINE_ID", {
            value: opts.mid,
            writable: false,
            configurable: false
        });

        return ret;
    }

}
