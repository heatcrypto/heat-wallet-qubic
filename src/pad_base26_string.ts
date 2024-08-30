export const padBase26String = (input: string) => {
  const paddedString = input.padStart(55, 'z');
  return paddedString;
}