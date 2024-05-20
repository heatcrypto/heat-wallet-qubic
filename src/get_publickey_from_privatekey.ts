import { hexToBase26 } from "./hex_to_base26";
import { padBase26String } from "./pad_base26_string";
import { getCryptoUtil, qubicHelper } from "./qubic";
import { uint8ArrayToHex } from "./uint8array_to_hex";

/**
 * Turns hex private key (from recovery seed) to publickey (hex)
 * @param params 
 * @returns {string}
 */
export const getPublicKeyFromPrivateKey = async (params: {
  privateKeyHex: string;
}) => {
  const { privateKeyHex } = params;
  const privateKeyAsBase26 = hexToBase26(privateKeyHex);
  const seed = padBase26String(privateKeyAsBase26);
  const privateKey = seedToPrivateKey(seed);
  const publicKey = privateKeyToPublicKey(privateKey);
  const publicKeyHex = uint8ArrayToHex(publicKey);
  return publicKeyHex;
};

export function privateKeyHexToQubicSeed(privateKeyHex: string) {
  const privateKeyAsBase26 = hexToBase26(privateKeyHex);
  return padBase26String(privateKeyAsBase26);
}

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
