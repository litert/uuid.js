import * as Errors from "./Errors";

export namespace GUID {

    /**
     * Seconds between 1582-10-15T00:00:00Z and 1970-01-01T00:00:00Z.
     */
    export const THE_SEC_GC_TO_EPOCH = 12125116800;

    export type TEncodings = "urn" | "string" | "buffer";

    export type TDefaultEncoding = "string";

    export const DEFAULT_ENCODING = "string";

    export const BYTE_LENGTH = 16;

    export const STRING_LENGTH = 36;

    export const URN_LENGTH = 45;

    export const URN_PREFIX = "urn:uuid:";

    export type IOutput<E extends TEncodings> = E extends "buffer" ? Buffer : string;

    export interface IGeneratorV1<E extends TEncodings> {

        <T extends TEncodings = E>(enc?: T): IOutput<T>;

        mac: string;
    }

    export interface IFactoryOptions<E extends TEncodings> {

        "output"?: E;
    }

    export interface IOptionsV1<E extends TEncodings>
    extends IFactoryOptions<E> {

        "mac": string;
    }

    export interface IFactory<E extends TEncodings> {

        /**
         * Create a GUID v1 generator.
         *
         * @param options The options of generator.
         */
        createV1<T extends TEncodings = E>(
            options: IOptionsV1<T>
        ): IGeneratorV1<T>;
    }

    class Factory implements IFactory<any> {

        private _encoding: TEncodings = DEFAULT_ENCODING;

        public constructor(opts?: IFactoryOptions<any>) {

            if (opts) {

                this._encoding = opts.output || DEFAULT_ENCODING;
            }
        }

        public createV1(opts: IOptionsV1<any>): IGeneratorV1<any> {

            const MAC = opts.mac.replace(/-/g, "").toLowerCase();

            const ENC = opts.output || this._encoding;

            if (!/^[a-f0-9]{12}$/.test(MAC)) {

                throw new Errors.E_INVALID_MAC_ADDR({
                    metadata: opts
                });
            }

            return (new Function(`
const BASE_CLOCK = ${THE_SEC_GC_TO_EPOCH}n * 10000000n;
const n100 = 100n;
const n32 = 32n;
const n16 = 16n;

let sequence = process.hrtime()[1];

let ret = function(enc = "${ENC}") {

    const CLOCK = BASE_CLOCK + process.hrtime.bigint() / n100;
    const SEG_1 = BigInt.asUintN(32, CLOCK).toString(16).padStart(8, "0");
    const HI_CLOCK = CLOCK >> n32;
    const SEG_2 = BigInt.asUintN(16, HI_CLOCK).toString(16).padStart(4, "0");
    const SEG_3 = "1" + (HI_CLOCK >> n16).toString(16).padStart(3, "0");
    const SEG_4 = ((sequence & 0b11111111111111) | 0b1000000000000000).toString(16);
    return \`\${SEG_1}-\${SEG_2}-\${SEG_3}-\${SEG_4}-${MAC}\`
};

return ret;
            `))() as any;
        }
    }

    export function createFactory<E extends TEncodings>(
        opts?: IFactoryOptions<E>
    ): IFactory<E> {

        return new Factory(opts);
    }
}
