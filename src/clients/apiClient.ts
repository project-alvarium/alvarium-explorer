/* eslint-disable camelcase */
import { FetchHelper } from "../helpers/fetchHelper";
import { IAddressReturn } from "../models/api/IAddressReturn";
import { IAnnotationQuery } from "../models/api/IAnnotationQuery";
import { IConfidenceScore } from "../models/api/IConfidenceScore";
import { IReadingAnnotation } from "../models/api/IReadingAnnotation";
import { ISensorReading } from "../models/api/ISensorReading";
import { ISubRequest } from "../models/api/ISubRequest";

/**
 * Service to handle the REST requests.
 */
export class ApiClient {
    /**
     * The endpoint to connect to.
     */
    private readonly _endpoint: string;

    private readonly _other_endpoint: string;

    /**
     * Create a new instance of ApiClient.
     * @param endpoint The endpoint for the author console requests.
     * @param otherEndpoint endpoint of the simulator
     */
    constructor(endpoint: string, otherEndpoint: string) {
        this._endpoint = endpoint.replace(/\/+$/, "");
        this._other_endpoint = otherEndpoint.replace(/\/+$/, "");
    }

    /**
     * Get readings for the sensor.
     * @param sensorId The sensor to get the readings for.
     * @returns The readings.
     */
    public async getReadings(sensorId: string): Promise<ISensorReading[] | undefined> {
        let response: ISensorReading[] | undefined;

        try {
            response = await FetchHelper.json<unknown, ISensorReading[]>(
                this._endpoint,
                "get_readings",
                "post",
                {
                    sensor_id: sensorId
                }
            );
        } catch {
        }

        return response;
    }

    /**
     * Get annotations for the reading.
     * @param readingId The reading to get the annotations for.
     * @returns The annotations.
     */
    public async getAnnotations(readingId: string): Promise<IReadingAnnotation[] | undefined> {
        let response: IReadingAnnotation[] | undefined;

        try {
            const responseWrapped = await FetchHelper.json<unknown, { annotation: IReadingAnnotation }[]>(
                this._endpoint,
                "get_annotations",
                "post",
                {
                    reading_id: readingId
                }
            );
            response = responseWrapped?.map(a => a.annotation);
        } catch {
        }

        return response;
    }

    /**
     * Get confidence score for the reading.
     * @param readingId The annotations for the reading.
     * @returns The annotations.
     */
    public async getConfidenceScore(readingId: string): Promise<IConfidenceScore | undefined> {
        let response: IConfidenceScore | undefined;

        try {
            response = await FetchHelper.json<unknown, IConfidenceScore>(
                this._endpoint,
                "get_confidence_score",
                "post",
                {
                    reading_id: readingId
                }
            );
        } catch {
        }

        return response;
    }

    /**
     * Get filtered annotations from provided filters.
     * @param query Query parameters.
     * @returns The annotations.
     */
    public async filterAnnotations(query: IAnnotationQuery): Promise<IReadingAnnotation[] | undefined> {
        let response: IReadingAnnotation[] | undefined;
        try {
            const responseWrapped = await FetchHelper.json<unknown, { annotation: IReadingAnnotation }[]>(
                this._endpoint,
                "get_filtered_annotations",
                "post",
                {
                    iss: query.iss,
                    sub: query.sub,
                    iat: query.iat,
                    jti: query.jti,
                    ann: query.ann
                }
            );
            response = responseWrapped?.map(a => a.annotation);
        } catch {
        }

        return response;
    }

    public async fetchAddress(): Promise<IAddressReturn | undefined> {
        const address = await FetchHelper.json<undefined, IAddressReturn>(
            this._endpoint,
            "get_announcement_id",
            "get"
        );
        return address;
    }

    public async addNewSub(query: ISubRequest, type: string) {
        try {
            console.log("Type:", type);
            await FetchHelper.json<unknown, unknown>(
                this._other_endpoint,
                `/api/${type}`,
                "post",
                {
                    Node: query.Node,
                    Address: query.Address,
                    Id: query.Id,
                    TickRate: query.TickRate
                }
            );
        } catch {
        }
    }
}
