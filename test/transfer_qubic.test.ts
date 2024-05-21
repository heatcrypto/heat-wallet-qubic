import { qubicReady } from "../src/qubic";
import { transferQubic } from "../src/transfer_qubic";
import { parseTransaction } from "../src/parse_transaction";

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
});
