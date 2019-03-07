// Re. EMV 3-D Specification: EMVCo_3DS_Spec_210_1017.pdf
export const challengeWindowSizes = {
    '01': ['250px', '400px'],
    '02': ['390px', '400px'],
    '03': ['500px', '600px'],
    '04': ['600px', '400px'],
    '05': ['100%', '100%']
};
export const defaultRootContainer = document.body;
export const threeDSVersion = '2.1.0';
export const THREEDS_METHOD_TIMEOUT = 10000;