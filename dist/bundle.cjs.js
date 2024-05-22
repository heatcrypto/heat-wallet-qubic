'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var qubicHelper$1 = require('qubic-ts-library/dist/qubicHelper');
var crypto = require('qubic-ts-library/dist/crypto/index');
var BigNumber = require('bignumber.js');
var QubicDefinitions = require('qubic-ts-library/dist/QubicDefinitions');
var PublicKey = require('qubic-ts-library/dist/qubic-types/PublicKey');
var Long = require('qubic-ts-library/dist/qubic-types/Long');
var QubicTransaction = require('qubic-ts-library/dist/qubic-types/QubicTransaction');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);
var BigNumber__default = /*#__PURE__*/_interopDefaultLegacy(BigNumber);

const qubicHelper = new qubicHelper$1.QubicHelper();
// Assign a value to prevent rollup from too aggressively optimizing my code
let cryptoUtil = {};
/**
 * Wallet code relies on synchronous functions for key derivation logic which is why
 * GetAddress, GetPublicKey etc have to run synchronouslay and cant wait for
 * the wasm to possibly have to be loaded.
 * Calling code MUST await `qubicReady()` BEFORE they can use any code that
 * relies on the wasm code.
 */
const qubicReady = async () => {
    if (typeof cryptoUtil.K12 === "undefined") {
        cryptoUtil = await crypto__default["default"];
    }
    return;
};
/**
 * Access method to get wasm related code, will throw when "qubicReady" was not called and
 * awaited prior to calling this method.
 */
const getCryptoUtil = () => {
    if (typeof cryptoUtil.K12 === "undefined") {
        throw new Error('You must call and await "qubicReady" first');
    }
    return cryptoUtil;
};

const isValidAddress = async (params) => {
    const { address } = params;
    const result = await qubicHelper.verifyIdentity(address);
    return result;
};

const hexToUint8Array = (hexString) => {
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

const CHECKSUM_LENGTH = 3; // https://github.com/qubic/ts-library/blob/main/src/qubicHelper.ts#L70C13-L70C28
const getAddressFromPublicKey = (params) => {
    const { publicKeyHex } = params;
    const publicKeyUint8Array = hexToUint8Array(publicKeyHex);
    const identity = getIdentity(publicKeyUint8Array);
    return identity;
};
function getIdentity(publicKey, lowerCase = false) {
    let newId = "";
    for (let i = 0; i < 4; i++) {
        let longNUmber = new BigNumber__default["default"](0);
        longNUmber.decimalPlaces(0);
        publicKey.slice(i * 8, (i + 1) * 8).forEach((val, index) => {
            longNUmber = longNUmber.plus(new BigNumber__default["default"]((val * 256 ** index).toString(2), 2));
        });
        for (let j = 0; j < 14; j++) {
            newId += String.fromCharCode(longNUmber
                .mod(26)
                .plus((lowerCase ? "a" : "A").charCodeAt(0))
                .toNumber());
            longNUmber = longNUmber.div(26);
        }
    }
    // calculate checksum
    const checksum = getCheckSum(publicKey);
    // convert to int
    let identityBytesChecksum = (checksum[2] << 16) | (checksum[1] << 8) | checksum[0];
    identityBytesChecksum = identityBytesChecksum & 0x3ffff;
    for (let i = 0; i < 4; i++) {
        newId += String.fromCharCode((identityBytesChecksum % 26) + (lowerCase ? "a" : "A").charCodeAt(0));
        identityBytesChecksum = identityBytesChecksum / 26;
    }
    return newId;
}
function getCheckSum(publicKey) {
    const { K12 } = getCryptoUtil();
    const digest = new Uint8Array(QubicDefinitions.QubicDefinitions.DIGEST_LENGTH);
    K12(publicKey, digest, QubicDefinitions.QubicDefinitions.DIGEST_LENGTH);
    const checksum = digest.slice(0, CHECKSUM_LENGTH);
    return checksum;
}

const uint8ArrayToHex = (array) => {
    let hexString = "";
    for (let i = 0; i < array.length; i++) {
        // Convert each byte to a hexadecimal string and pad with '0' if necessary
        const hex = array[i].toString(16);
        hexString += hex.length === 1 ? "0" + hex : hex;
    }
    return hexString;
};

/**
 * Turns hex private key (from recovery seed) to publickey (hex)
 * @param params
 * @returns {string}
 */
const getPublicKeyFromPrivateKey = (params) => {
    const { qubicBase26Seed } = params;
    const privateKey = seedToPrivateKey(qubicBase26Seed);
    const publicKey = privateKeyToPublicKey(privateKey);
    const publicKeyHex = uint8ArrayToHex(publicKey);
    return publicKeyHex;
};
function seedToPrivateKey(seed) {
    const { K12 } = getCryptoUtil();
    const privateKey = qubicHelper.privateKey(seed, 0, K12);
    return privateKey;
}
function privateKeyToPublicKey(privateKey) {
    const { schnorrq } = getCryptoUtil();
    const publicKey = schnorrq.generatePublicKey(privateKey);
    return publicKey;
}

const parseTransaction = (params) => {
    const { hex } = params;
    const bytes = hexToUint8Array(hex);
    const parsedTxn = parseUint8ArrayQubicTransaction(bytes);
    const { sourceIdentity, destinationIdentity, amount, tick, inputType, inputSize, } = parsedTxn;
    return {
        sourceIdentity,
        destinationIdentity,
        amount: amount.getNumber().toString(),
        tick,
        inputType,
        inputSize,
    };
};
function parseUint8ArrayQubicTransaction(data) {
    let offset = 0;
    // Read the source public key
    const sourcePublicKey = new PublicKey.PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    // Read the destination public key
    const destinationPublicKey = new PublicKey.PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    // Read the amount (assuming a 64-bit long)
    const amount = new Long.Long(new DataView(data.buffer, offset, 8).getBigInt64(0, true));
    offset += 8;
    // Read the tick (32-bit integer)
    const tick = new DataView(data.buffer, offset, 4).getInt32(0, true);
    offset += 4;
    // Read the input type (16-bit integer)
    const inputType = data[offset] + (data[offset + 1] << 8);
    offset += 2;
    // Read the input size (16-bit integer)
    const inputSize = data[offset] + (data[offset + 1] << 8);
    offset += 2;
    // TODO.. Add support for payload parsing (not needed at this stage)
    // // Read the payload
    // const payloadData = data.slice(offset, offset + inputSize);
    // const payload = new DynamicPayload(inputSize); // Placeholder for actual payload handling
    // payload.setPackageData(payloadData);
    // transaction.setPayload(payload);
    // offset += inputSize;
    // // Read the signature (assuming fixed length, modify as necessary)
    // const signatureData = data.slice(offset); // Assume rest is signature
    // const signature = new Signature();
    // signature.setSignature(signatureData);
    // transaction.signature = signature;
    const sourceIdentity = getIdentity(sourcePublicKey.getIdentity());
    const destinationIdentity = getIdentity(destinationPublicKey.getIdentity());
    return {
        sourceIdentity,
        destinationIdentity,
        amount,
        tick,
        inputType,
        inputSize,
    };
}

/**
 * Transfers QU from one address to another, as key we accept either a hex privatekey as obtained
 * from a recovery seed - or a standard base26 Qubic seed.
 *
 * @param params
 */
const transferQubic = async (params) => {
    const { fromAddress, toAddress, value, qubicBase26Seed, tick } = params;
    const sourcePublicKey = new PublicKey.PublicKey(fromAddress);
    const destinationPublicKey = new PublicKey.PublicKey(toAddress);
    const tx = new QubicTransaction.QubicTransaction()
        .setSourcePublicKey(sourcePublicKey)
        .setDestinationPublicKey(destinationPublicKey)
        .setAmount(new Long.Long(BigInt(value)))
        .setTick(tick);
    await tx.build(qubicBase26Seed);
    const transactionId = tx.id;
    const transactionAsHex = uint8ArrayToHex(tx.getPackageData());
    return {
        transactionAsHex,
        transactionId,
    };
};

const base26Chars = 'abcdefghijklmnopqrstuvwxyz';
const hexToBase26 = (hexString) => {
    let hexNum = BigInt(`0x${hexString}`);
    let base26Str = '';
    while (hexNum > 0n) {
        let remainder = hexNum % 26n;
        hexNum = hexNum / 26n;
        // Convert BigInt remainder to a number before using it as an index
        base26Str = base26Chars[Number(remainder)] + base26Str;
    }
    return base26Str;
};

const padBase26String = (input) => {
    const paddedString = input.padStart(55, 'Z');
    return paddedString;
};

/**
 * Qubic uses base26 seeds as private keys, once we generate a private key through
 * HD wallet derivation we turn the hex private key into a qubic seed.
 * Then after that we use the qubic seed and we dont use the hex private key anymore.
 *
 * @param params {{
 *  privateKeyHex: string
 * }}
 * @returns {string}
 */
const privatekeyHexToQubicBase26Seed = (params) => {
    const { privateKeyHex } = params;
    const privateKeyAsBase26 = hexToBase26(privateKeyHex);
    const seed = padBase26String(privateKeyAsBase26);
    return seed;
};

const getTransactionId = (params) => {
    const { transactionAsHex } = params;
    const { K12 } = getCryptoUtil();
    const bytes = hexToUint8Array(transactionAsHex);
    const digest = new Uint8Array(QubicDefinitions.QubicDefinitions.DIGEST_LENGTH);
    K12(bytes, digest, QubicDefinitions.QubicDefinitions.DIGEST_LENGTH);
    const humanReadable = getIdentity(digest, true);
    return humanReadable;
};

exports.getAddressFromPublicKey = getAddressFromPublicKey;
exports.getCryptoUtil = getCryptoUtil;
exports.getIdentity = getIdentity;
exports.getPublicKeyFromPrivateKey = getPublicKeyFromPrivateKey;
exports.getTransactionId = getTransactionId;
exports.isValidAddress = isValidAddress;
exports.parseTransaction = parseTransaction;
exports.privateKeyToPublicKey = privateKeyToPublicKey;
exports.privatekeyHexToQubicBase26Seed = privatekeyHexToQubicBase26Seed;
exports.qubicHelper = qubicHelper;
exports.qubicReady = qubicReady;
exports.seedToPrivateKey = seedToPrivateKey;
exports.transferQubic = transferQubic;
//# sourceMappingURL=bundle.cjs.js.map
