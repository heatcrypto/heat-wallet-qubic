import { qubicReady } from "../src/qubic";
import { transferAsset } from "../src/transfer_asset";
import { parseTransaction } from "../src/parse_transaction";
import { QubicDefinitions } from "qubic-ts-library/dist/QubicDefinitions";
import { getTransactionId } from "../src/get_transaction_id";
// import { getTransactionId } from "../src/get_transaction_id";

describe("transfer_asset", () => {
  const sourceId =
    "CSOXIPNXRTKTCCOEQYNGUOGPOOBCUXZJNOULAFMYBBEUHCHLUZFJZLVEOPGM";
  const destId = "CSYDQBGKHIMMHEAINZODIQIBZVICDXGQQEQHGLBQYGTTRXABGRAMFYIGALQF";
  const issuerId = "SUZFFQSCVPHYYBDCQODEMFAOKRJDDDIRJFFIWFLRDDJQRPKMJNOCSSKHXHGK";
  const signSeed = "slkdfj";

  it("generates a transfer asset transaction", async () => {
    await qubicReady();

    const result = await transferAsset({
      fromAddress: sourceId,
      toAddress: destId,
      value: "1000000",
      qubicBase26Seed: signSeed,
      tick: 919191919,
      assetName: 'abcdef',
      assetIssuer: issuerId
    });
    expect(result.transactionId).toBe(
      "zzsmwvoyznuiafjqgiojcbqjftuaohxsywvxcclayfixchasjlgajscfrnmi"
    );

    const parsed = parseTransaction({ hex: result.transactionAsHex });

    expect(QubicDefinitions.QX_ADDRESS).toBe('BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARMID')
    expect(parsed.sourceIdentity).toBe(sourceId);
    expect(parsed.destinationIdentity).toBe(QubicDefinitions.QX_ADDRESS);
    expect(parsed.amount).toEqual(`${QubicDefinitions.QX_TRANSFER_ASSET_FEE}`);
    expect(parsed.tick).toEqual(919191919);
    expect(parsed.assetTransfer).toBeDefined()
    expect(parsed.assetTransfer?.assetName).toEqual('abcdef')
    expect(parsed.assetTransfer?.issuer).toEqual(issuerId)
    expect(parsed.assetTransfer?.newOwnerAndPocessor).toEqual(destId)
    expect(parsed.assetTransfer?.numberOfUnits).toEqual("1000000")
  });

  it("gets the transaction id from bytes", async () => {
    await qubicReady();
    const result = await transferAsset({
      fromAddress: sourceId,
      toAddress: destId,
      value: "1000000",
      qubicBase26Seed: signSeed,
      tick: 919191919,
      assetName: 'abcdef',
      assetIssuer: issuerId
    });
    const expectedTransactionId =
      "zzsmwvoyznuiafjqgiojcbqjftuaohxsywvxcclayfixchasjlgajscfrnmi";
    expect(result.transactionId).toBe(expectedTransactionId);
    const calculatedTransactionId = getTransactionId({
      transactionAsHex: result.transactionAsHex,
    });
    expect(calculatedTransactionId).toBe(expectedTransactionId);
  });
});
