import { QubicHelper } from "qubic-ts-library/dist/qubicHelper";
import crypto from "qubic-ts-library/dist/crypto/index";

export const qubicHelper = new QubicHelper();

// Assign a value to prevent rollup from too aggressively optimizing my code
let cryptoUtil: { K12: any; schnorrq: any } | any = {};

/**
 * Wallet code relies on synchronous functions for key derivation logic which is why
 * GetAddress, GetPublicKey etc have to run synchronouslay and cant wait for
 * the wasm to possibly have to be loaded.
 * Calling code MUST await `qubicReady()` BEFORE they can use any code that
 * relies on the wasm code.
 */
export const qubicReady = async (): Promise<void> => {
  if (typeof cryptoUtil.K12 === "undefined") {
    cryptoUtil = await crypto;
  }
  return;
};

/**
 * Access method to get wasm related code, will throw when "qubicReady" was not called and
 * awaited prior to calling this method.
 */
export const getCryptoUtil = () => {
  if (typeof cryptoUtil.K12 === "undefined") {
    throw new Error('You must call and await "qubicReady" first');
  }
  return cryptoUtil;
};
