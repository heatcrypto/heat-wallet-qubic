import { qubicReady } from "../src/qubic";
import { transferQubic } from "../src/transfer_qubic";
import { parseTransaction } from "../src/parse_transaction";
import { getTransactionId } from "../src/get_transaction_id";

describe("transfer_qubic", () => {
  const sourceId =
    "CSOXIPNXRTKTCCOEQYNGUOGPOOBCUXZJNOULAFMYBBEUHCHLUZFJZLVEOPGM";
  const destId = "CSOXIPNXRTKTCCOEQYNGUOGPOOBCUXZJNOULAFMYBBEUHCHLUZFJZLVEOPGM";
  const signSeed = "slkdfj";

  it("generates a transfer transaction", async () => {
    await qubicReady();

    const result = await transferQubic({
      fromAddress: sourceId,
      toAddress: destId,
      value: "1000000",
      qubicBase26Seed: signSeed,
      tick: 919191919,
    });
    expect(result.transactionId).toBe(
      "kaaabjubzuukkftcelellgfeoguesnzapjtojpsewawpahwstwzsgwzagkja"
    );

    const parsed = parseTransaction({ hex: result.transactionAsHex });

    expect(parsed.sourceIdentity).toBe(sourceId);
    expect(parsed.destinationIdentity).toBe(destId);
    expect(parsed.amount).toBe("1000000");
    expect(parsed.tick).toBe(919191919);
  });

  it("gets the transaction id from bytes", async () => {
    await qubicReady();
    const result = await transferQubic({
      fromAddress: sourceId,
      toAddress: destId,
      value: "1000000",
      qubicBase26Seed: signSeed,
      tick: 919191919,
    });
    const expectedTransactionId =
      "kaaabjubzuukkftcelellgfeoguesnzapjtojpsewawpahwstwzsgwzagkja";
    expect(result.transactionId).toBe(expectedTransactionId);
    const calculatedTransactionId = getTransactionId({
      transactionAsHex: result.transactionAsHex,
    });
    expect(calculatedTransactionId).toBe(expectedTransactionId);
  });
});
