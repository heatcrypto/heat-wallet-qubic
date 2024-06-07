export declare const parseTransaction: (params: {
    hex: string;
}) => {
    sourceIdentity: string;
    destinationIdentity: string;
    amount: string;
    tick: number;
    inputType: number;
    inputSize: number;
    assetTransfer?: {
        issuer: string;
        newOwnerAndPocessor: string;
        assetName: string;
        numberOfUnits: string;
    };
};
