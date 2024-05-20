const base26Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const hexToBase26 = (hexString: string): string => {
  let hexNum = BigInt(`0x${hexString}`);
  let base26Str = '';
  while (hexNum > 0n) {
      let remainder = hexNum % 26n;
      hexNum = hexNum / 26n;
      // Convert BigInt remainder to a number before using it as an index
      base26Str = base26Chars[Number(remainder)] + base26Str;
  }

  return base26Str;
}