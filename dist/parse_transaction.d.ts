export declare const parseTransaction: (params: {
    hex: string;
}) => {
    sourceIdentity: string;
    destinationIdentity: string;
    amount: string;
    tick: number;
    inputType: number;
    inputSize: number;
};
