import { getCryptoUtil, qubicHelper } from "./qubic";
import { uint8ArrayToHex } from "./uint8array_to_hex";

/**
 * Turns hex private key (from recovery seed) to publickey (hex)
 * @param params 
 * @returns {string}
 */
export const getPublicKeyFromPrivateKey = async (params: {
  qubicBase26Seed: string;
}) => {
  const { qubicBase26Seed } = params;
  const privateKey = seedToPrivateKey(qubicBase26Seed);
  const publicKey = privateKeyToPublicKey(privateKey);
  const publicKeyHex = uint8ArrayToHex(publicKey);
  return publicKeyHex;
};

export function seedToPrivateKey(seed: string): Uint8Array {
  const { K12 } = getCryptoUtil();
  const privateKey = qubicHelper.privateKey(seed, 0, K12);
  return privateKey;
}

export function privateKeyToPublicKey(privateKey: Uint8Array): Uint8Array {
  const { schnorrq } = getCryptoUtil();
  const publicKey = schnorrq.generatePublicKey(privateKey);
  return publicKey;
}
