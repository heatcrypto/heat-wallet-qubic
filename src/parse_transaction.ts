import { PublicKey } from "qubic-ts-library/dist/qubic-types/PublicKey";
import { Long } from "qubic-ts-library/dist/qubic-types/Long";
import { getIdentity } from "./get_address_from_publickey";
import { hexToUint8Array } from "./hex_to_unint8array";

export const parseTransaction = (params: {
  hex: string;
}): {
  sourceIdentity: string;
  destinationIdentity: string;
  amount: string;
  tick: number;
  inputType: number;
  inputSize: number;
} => {
  const { hex } = params;
  const bytes = hexToUint8Array(hex);
  const parsedTxn = parseUint8ArrayQubicTransaction(bytes);
  const {
    sourceIdentity,
    destinationIdentity,
    amount,
    tick,
    inputType,
    inputSize,
  } = parsedTxn;
  return {
    sourceIdentity,
    destinationIdentity,
    amount: amount.getNumber().toString(),
    tick,
    inputType,
    inputSize,
  };
};

function parseUint8ArrayQubicTransaction(data: Uint8Array): {
  sourceIdentity: string;
  destinationIdentity: string;
  amount: Long;
  tick: number;
  inputType: number;
  inputSize: number;
} {
  let offset = 0;

  // Read the source public key
  const sourcePublicKey = new PublicKey(data.slice(offset, offset + 32));
  offset += 32;

  // Read the destination public key
  const destinationPublicKey = new PublicKey(data.slice(offset, offset + 32));
  offset += 32;

  // Read the amount (assuming a 64-bit long)
  const amount = new Long(
    new DataView(data.buffer, offset, 8).getBigInt64(0, true)
  );
  offset += 8;

  // Read the tick (32-bit integer)
  const tick = new DataView(data.buffer, offset, 4).getInt32(0, true);
  offset += 4;

  // Read the input type (16-bit integer)
  const inputType = data[offset] + (data[offset + 1] << 8);
  offset += 2;

  // Read the input size (16-bit integer)
  const inputSize = data[offset] + (data[offset + 1] << 8);
  offset += 2;

  // TODO.. Add support for payload parsing (not needed at this stage)

  // // Read the payload
  // const payloadData = data.slice(offset, offset + inputSize);
  // const payload = new DynamicPayload(inputSize); // Placeholder for actual payload handling
  // payload.setPackageData(payloadData);
  // transaction.setPayload(payload);
  // offset += inputSize;

  // // Read the signature (assuming fixed length, modify as necessary)
  // const signatureData = data.slice(offset); // Assume rest is signature
  // const signature = new Signature();
  // signature.setSignature(signatureData);
  // transaction.signature = signature;

  const sourceIdentity = getIdentity(sourcePublicKey.getIdentity());
  const destinationIdentity = getIdentity(destinationPublicKey.getIdentity());

  return {
    sourceIdentity,
    destinationIdentity,
    amount,
    tick,
    inputType,
    inputSize,
  };
}
