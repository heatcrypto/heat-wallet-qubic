export const hexToUint8Array = (hexString: string): Uint8Array => {
  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }
  const length = hexString.length / 2;
  const data = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    const byteHex = hexString.slice(i * 2, i * 2 + 2);
    data[i] = parseInt(byteHex, 16);
  }

  return data;
};
