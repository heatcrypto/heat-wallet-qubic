/**
 * Qubic uses base26 seeds as private keys, once we generate a private key through
 * HD wallet derivation we turn the hex private key into a qubic seed.
 * Then after that we use the qubic seed and we dont use the hex private key anymore.
 *
 * @param params {{
 *  privateKeyHex: string
 * }}
 * @returns {string}
 */
export declare const privatekeyHexToQubicBase26Seed: (params: {
    privateKeyHex: string;
}) => string;
