import BigNumber from "bignumber.js";
import { hexToUint8Array } from "./hex_to_unint8array";
import { getCryptoUtil } from "./qubic";
import { QubicDefinitions } from "qubic-ts-library/dist/QubicDefinitions";

const CHECKSUM_LENGTH = 3; // https://github.com/qubic/ts-library/blob/main/src/qubicHelper.ts#L70C13-L70C28

export const getAddressFromPublicKey = (params: { publicKeyHex: string }) => {
  const { publicKeyHex } = params;
  const publicKeyUint8Array = hexToUint8Array(publicKeyHex);
  const identity = getIdentity(publicKeyUint8Array);
  return identity;
};

export function getIdentity(
  publicKey: Uint8Array,
  lowerCase: boolean = false
): string {
  let newId = "";
  for (let i = 0; i < 4; i++) {
    let longNUmber = new BigNumber(0);
    longNUmber.decimalPlaces(0);
    publicKey.slice(i * 8, (i + 1) * 8).forEach((val, index) => {
      longNUmber = longNUmber.plus(
        new BigNumber((val * 256 ** index).toString(2), 2)
      );
    });
    for (let j = 0; j < 14; j++) {
      newId += String.fromCharCode(
        longNUmber
          .mod(26)
          .plus((lowerCase ? "a" : "A").charCodeAt(0))
          .toNumber()
      );
      longNUmber = longNUmber.div(26);
    }
  }

  // calculate checksum
  const checksum = getCheckSum(publicKey);

  // convert to int
  let identityBytesChecksum =
    (checksum[2] << 16) | (checksum[1] << 8) | checksum[0];
  identityBytesChecksum = identityBytesChecksum & 0x3ffff;

  for (let i = 0; i < 4; i++) {
    newId += String.fromCharCode(
      (identityBytesChecksum % 26) + (lowerCase ? "a" : "A").charCodeAt(0)
    );
    identityBytesChecksum = identityBytesChecksum / 26;
  }
  return newId;
}

function getCheckSum(publicKey: Uint8Array): Uint8Array {
  const { K12 } = getCryptoUtil();
  const digest = new Uint8Array(QubicDefinitions.DIGEST_LENGTH);
  K12(publicKey, digest, QubicDefinitions.DIGEST_LENGTH);
  const checksum = digest.slice(0, CHECKSUM_LENGTH);
  return checksum;
}
