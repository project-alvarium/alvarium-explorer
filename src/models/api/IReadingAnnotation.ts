/* eslint-disable camelcase */
export interface IReadingAnnotation {
    header: {
        alg: string;
        type: string;
    };
    payload: {
        iss: string;
        sub: string;
        iat: number;
        jti: string;
        ann: string;
        avl: number;
    };
    signature: string;
}
