/**
 * Transfers QU from one address to another, as key we accept either a hex privatekey as obtained
 * from a recovery seed - or a standard base26 Qubic seed.
 *
 * @param params
 */
export declare const transferQubic: (params: {
    fromAddress: string;
    toAddress: string;
    value: string;
    qubicBase26Seed: string;
    tick: number;
}) => Promise<{
    transactionAsHex: string;
    transactionId: string | undefined;
}>;
