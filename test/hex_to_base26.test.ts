import { hexToBase26 } from "../src/hex_to_base26";

describe("hex_to_base26", () => {
  const tests = [
    [
      "8afe6a66ab05e757f85926a3f88a2aa193da404ca019f7e227398c41576d4769",
      "CLUXKQEMOPKFZBJVWFBQISPEIEFGMKETBAPQUEZGNLDZTWGGLMIMPVL",
    ],
  ];

  for (const [hexString, expectedBase26] of tests) {
    it("should convert from hex to base26", () => {
      const actualBase26 = hexToBase26(hexString);
      expect(actualBase26).toBe(expectedBase26);
    });
  }
});
