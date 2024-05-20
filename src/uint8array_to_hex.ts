export const uint8ArrayToHex = (array: Uint8Array) => {
  let hexString = "";
  for (let i = 0; i < array.length; i++) {
    // Convert each byte to a hexadecimal string and pad with '0' if necessary
    const hex = array[i].toString(16);
    hexString += hex.length === 1 ? "0" + hex : hex;
  }
  return hexString;
};
