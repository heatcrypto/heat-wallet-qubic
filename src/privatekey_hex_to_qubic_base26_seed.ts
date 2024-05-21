import { hexToBase26 } from "./hex_to_base26";
import { padBase26String } from "./pad_base26_string";

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
export const privatekeyHexToQubicBase26Seed = (params: { privateKeyHex: string }) => {
  const { privateKeyHex } = params;
  const privateKeyAsBase26 = hexToBase26(privateKeyHex);
  const seed = padBase26String(privateKeyAsBase26);
  return seed;
};
