import { ISensorReading } from "../../models/api/ISensorReading";

export interface ExplorerState {
    /**
     * The query for the search.
     */
    query: string;

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
}
