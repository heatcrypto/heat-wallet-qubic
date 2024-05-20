import { qubicHelper } from "./qubic";

export const isValidAddress = async (params: { address: string }) => {
  const { address } = params;
  const result = await qubicHelper.verifyIdentity(address);
  return result;
};
