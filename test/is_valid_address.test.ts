import { isValidAddress } from "../src/is_valid_address";

describe("is_valid_address", () => {
  describe("finds valid addresses", () => {
    const validAddresses = [
      "IGJQYTMFLVNIMEAKLANHKGNGZPFCFJGSMVOWMNGLWCZWKFHANHGCBYODMKBC",
    ];
    for (const address of validAddresses) {
      it(`should find ${address} to be valid`, async () => {
        const isValid = await isValidAddress({ address });
        expect(isValid).toBeTruthy();
      });
    }
  });

  describe("finds invalid addresses", () => {
    const validAddresses = ["abc"];
    for (const address of validAddresses) {
      it(`should find ${address} to be in-valid`, async () => {
        const isValid = await isValidAddress({ address });
        expect(isValid).toBeFalsy();
      });
    }
  });
});
