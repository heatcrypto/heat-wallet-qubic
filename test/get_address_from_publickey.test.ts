import { uint8ArrayToHex } from "../src/uint8array_to_hex";
import { qubicReady } from "../src/qubic";
import { getAddressFromPublicKey } from "../src/get_address_from_publickey";

// based on https://github.com/qubic/ts-library/blob/main/test/publicKeyTest.js

describe("get_address_from_publickey", () => {

  const publicKey = new Uint8Array(32);
  publicKey.set([
    54, 175, 22, 213, 38, 91, 116, 67, 215, 152, 137, 17, 34, 185, 26, 116, 137,
    55, 82, 16, 127, 224, 40, 108, 69, 133, 107, 215, 147, 227, 57, 255,
  ]);
  const publicKeyHex = uint8ArrayToHex(publicKey);

  it("gets an address from a publickey", async () => {
    await qubicReady();
    const actualIdentity = getAddressFromPublicKey({ publicKeyHex });
    const expectedIdentity =
      "SUZFFQSCVPHYYBDCQODEMFAOKRJDDDIRJFFIWFLRDDJQRPKMJNOCSSKHXHGK";
    expect(actualIdentity).toBe(expectedIdentity);
  });
});
