/**
 * Transfers QU from one address to another.
 *
 * @param params
 */

import { PublicKey } from "qubic-ts-library/dist/qubic-types/PublicKey";
import { QubicTransaction } from "qubic-ts-library/dist/qubic-types/QubicTransaction";
import { Long } from "qubic-ts-library/dist/qubic-types/Long";
import { uint8ArrayToHex } from "./uint8array_to_hex";

export const transferQubic = async (params: {
  fromAddress: string;
  toAddress: string;
  value: string;
  qubicBase26Seed: string;
  tick: number;
}) => {
  const { fromAddress, toAddress, value, qubicBase26Seed, tick } = params;
  const sourcePublicKey = new PublicKey(fromAddress);
  const destinationPublicKey = new PublicKey(toAddress);

  const tx = new QubicTransaction()
    .setSourcePublicKey(sourcePublicKey)
    .setDestinationPublicKey(destinationPublicKey)
    .setAmount(new Long(BigInt(value)))
    .setTick(tick);
  await tx.build(qubicBase26Seed);
  const transactionId = tx.id;
  const transactionAsHex = uint8ArrayToHex(tx.getPackageData())
  return {
    transactionAsHex,
    transactionId,
  };
};
