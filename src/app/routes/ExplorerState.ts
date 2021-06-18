import { IAnnotationQuery } from "../../models/api/IAnnotationQuery";
import { IReadingAnnotation } from "../../models/api/IReadingAnnotation";
import { ISensorReading } from "../../models/api/ISensorReading";
import { ISubRequest } from "../../models/api/ISubRequest";

export interface ExplorerState {
    /**
     * The query for the search.
     */
    sensor: string;

    /**
     * Query data for filtered search.
     */
    query: IAnnotationQuery;

    subReq: ISubRequest;

    firstRun: boolean;

    /**
     * Is the form busy.
     */
    statusBusy: boolean;

    /**
     * Status to display.
     */
    status: string;

    /**
     * The sensor readings.
     */
    sensorReadings?: ISensorReading[];

    /**
     * The annotations
     */
    readingAnnotations?: IReadingAnnotation[];

    sensors?: string[];

    startAddress: string;
}
