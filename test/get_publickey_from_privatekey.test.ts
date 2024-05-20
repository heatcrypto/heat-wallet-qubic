import { uint8ArrayToHex } from "../src/uint8array_to_hex";
import { qubicReady } from "../src/qubic";
import { getAddressFromPublicKey } from "../src/get_address_from_publickey";
import { seedToPrivateKey, privateKeyToPublicKey } from "../src/get_publickey_from_privatekey";

// based on https://github.com/qubic/ts-library/blob/main/test/createIdTest.js

describe("get_publickey_from_privatekey", () => {
  it('correctly turns a seed into an id', async () => {
    await qubicReady();
    const seed = "wqbdupxgcaimwdsnchitjmsplzclkqokhadgehdxqogeeiovzvadstt";
    const expectedPublicId = "SUZFFQSCVPHYYBDCQODEMFAOKRJDDDIRJFFIWFLRDDJQRPKMJNOCSSKHXHGK";

    const privateKey = seedToPrivateKey(seed)
    const publicKey = privateKeyToPublicKey(privateKey);
    const publicKeyHex = uint8ArrayToHex(publicKey);
    const actualPublicId = getAddressFromPublicKey({publicKeyHex})
    expect(expectedPublicId).toBe(actualPublicId)
  })
});