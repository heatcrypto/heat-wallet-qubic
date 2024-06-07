/**
 * Transfers Qubic Asset from one address to another.
 *
 * @param params
 */

import { PublicKey } from "qubic-ts-library/dist/qubic-types/PublicKey";
import { QubicTransaction } from "qubic-ts-library/dist/qubic-types/QubicTransaction";
import { Long } from "qubic-ts-library/dist/qubic-types/Long";
import { uint8ArrayToHex } from "./uint8array_to_hex";
import { QubicTransferAssetPayload } from "qubic-ts-library/dist/qubic-types/transacion-payloads/QubicTransferAssetPayload";
import { QubicDefinitions } from "qubic-ts-library/dist/QubicDefinitions";

export const transferAsset = async (params: {
  fromAddress: string;
  toAddress: string;
  value: string;
  qubicBase26Seed: string;
  tick: number;
  assetName: string;
  assetIssuer: string;
}) => {
  const {
    fromAddress,
    toAddress,
    value,
    qubicBase26Seed,
    tick,
    assetName,
    assetIssuer,
  } = params;
  const sourcePublicKey = new PublicKey(fromAddress);
  const destinationPublicKey = new PublicKey(toAddress);
  const assetIssuerPublicKey = new PublicKey(assetIssuer);

  const assetTransfer = new QubicTransferAssetPayload()
    .setIssuer(assetIssuerPublicKey)
    .setNewOwnerAndPossessor(destinationPublicKey)
    .setAssetName(assetName)
    .setNumberOfUnits(new Long(BigInt(value)));

  const tx = new QubicTransaction()
    .setSourcePublicKey(sourcePublicKey)
    .setDestinationPublicKey(QubicDefinitions.QX_ADDRESS)
    .setAmount(QubicDefinitions.QX_TRANSFER_ASSET_FEE)
    .setTick(tick)
    .setInputType(QubicDefinitions.QX_TRANSFER_ASSET_INPUT_TYPE)
    .setPayload(assetTransfer);
  await tx.build(qubicBase26Seed);
  const transactionId = tx.id;
  const transactionAsHex = uint8ArrayToHex(tx.getPackageData());
  return {
    transactionAsHex,
    transactionId,
  };
};
