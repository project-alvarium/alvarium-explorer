export interface IConfiguration {
    /**
     * The endpoint for the REST api.
     */
    apiEndpoint: string;

    simulatorEndpoint: string;

    /**
     * The predefined sensor identifiers.
     */
    sensorIds: string[];
}
