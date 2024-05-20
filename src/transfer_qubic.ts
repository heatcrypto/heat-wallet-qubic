/**
 * Transfers QU from one address to another, as key we accept either a hex privatekey as obtained
 * from a recovery seed - or a standard base26 Qubic seed.
 *
 * @param params
 */

import { PublicKey } from "qubic-ts-library/dist/qubic-types/PublicKey";
import { privateKeyHexToQubicSeed } from "./get_publickey_from_privatekey";
import { QubicTransaction } from "qubic-ts-library/dist/qubic-types/QubicTransaction";
import { Long } from "qubic-ts-library/dist/qubic-types/Long";
import { uint8ArrayToHex } from "./uint8array_to_hex";

export const transferQubic = async (params: {
  fromAddress: string;
  toAddress: string;
  value: string;
  key: {
    privateKeyHex?: string;
    qubicBase26Seed?: string;
  };
  tick: number;
}) => {
  const { fromAddress, toAddress, value, key, tick } = params;
  const sourcePublicKey = new PublicKey(fromAddress);
  const destinationPublicKey = new PublicKey(toAddress);

  let signSeed: string;
  if (key.privateKeyHex) {
    signSeed = privateKeyHexToQubicSeed(key.privateKeyHex);
  } else if (key.qubicBase26Seed) {
    signSeed = key.qubicBase26Seed!;
  } else {
    throw new Error('Missing "key" param');
  }

  const tx = new QubicTransaction()
    .setSourcePublicKey(sourcePublicKey)
    .setDestinationPublicKey(destinationPublicKey)
    .setAmount(new Long(BigInt(value)))
    .setTick(tick);
  await tx.build(signSeed);
  const transactionId = tx.id;
  const transactionAsHex = uint8ArrayToHex(tx.getPackageData())
  return {
    transactionAsHex,
    transactionId,
  };
};
