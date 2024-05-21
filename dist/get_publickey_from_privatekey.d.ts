/**
 * Turns hex private key (from recovery seed) to publickey (hex)
 * @param params
 * @returns {string}
 */
export declare const getPublicKeyFromPrivateKey: (params: {
    qubicBase26Seed: string;
}) => Promise<string>;
export declare function seedToPrivateKey(seed: string): Uint8Array;
export declare function privateKeyToPublicKey(privateKey: Uint8Array): Uint8Array;
