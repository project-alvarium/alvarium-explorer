import { ISensorReading } from "../../models/api/ISensorReading";
import { IAnnotationQuery} from "../../models/api/IAnnotationQuery";
import {IReadingAnnotation} from "../../models/api/IReadingAnnotation";

export interface ExplorerState {
    /**
     * The query for the search.
     */
    sensor: string;

    /**
     * Query data for filtered search.
     */
    query: IAnnotationQuery;

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
}
