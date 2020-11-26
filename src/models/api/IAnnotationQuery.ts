/* eslint-disable camelcase */
export interface IAnnotationQuery {
    /**
     * The issuing machine
     */
    iss: (string | null);

    /**
     * The subject of the annotation.
     */
    sub: (string | null);

    /**
     * Timestamp of annotation generation.
     */
    iat: (number | null);

    /**
     * Unique identifier for json token.
     */
    jti: (string | null);

    /**
     * Type of annotation.
     */
    ann: (string | null);
}
