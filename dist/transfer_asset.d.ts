/**
 * Transfers Qubic Asset from one address to another.
 *
 * @param params
 */
export declare const transferAsset: (params: {
    fromAddress: string;
    toAddress: string;
    value: string;
    qubicBase26Seed: string;
    tick: number;
    assetName: string;
    assetIssuer: string;
}) => Promise<{
    transactionAsHex: string;
    transactionId: string | undefined;
}>;
