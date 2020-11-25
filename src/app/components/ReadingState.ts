import { IReadingAnnotation } from "../../models/api/IReadingAnnotation";

export interface ReadingState {
    /**
     * The reading annotations.
     */
    readingAnnotations?: IReadingAnnotation[];

    /**
     * The confidence score.
     */
    confidenceScore: number;
}
