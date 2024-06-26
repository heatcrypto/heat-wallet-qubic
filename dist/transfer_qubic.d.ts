/**
 * Transfers QU from one address to another.
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
