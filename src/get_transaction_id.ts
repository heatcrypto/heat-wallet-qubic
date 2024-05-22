import { QubicDefinitions } from "qubic-ts-library/dist/QubicDefinitions";
import { hexToUint8Array } from "./hex_to_unint8array";
import { getIdentity } from "./get_address_from_publickey";
import { getCryptoUtil } from "./qubic";

export const getTransactionId = (params: { transactionAsHex: string }) => {
  const { transactionAsHex } = params;
  const { K12 } = getCryptoUtil();
  const bytes = hexToUint8Array(transactionAsHex);
  const digest = new Uint8Array(QubicDefinitions.DIGEST_LENGTH);
  K12(bytes, digest, QubicDefinitions.DIGEST_LENGTH);

  const humanReadable = getIdentity(digest, true);
  return humanReadable;
};
