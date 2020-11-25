import React, { Component, ReactNode } from "react";
import { ApiClient } from "../../clients/apiClient";
import { ServiceFactory } from "../../factories/serviceFactory";
import { DateHelper } from "../../helpers/dateHelper";
import Spinner from "../components/Spinner";
import "./Reading.scss";
import { ReadingProps } from "./ReadingProps";
import { ReadingState } from "./ReadingState";

/**
 * Reading panel.
 */
class Reading extends Component<ReadingProps, ReadingState> {
    /**
     * API Client.
     */
    private readonly _apiClient: ApiClient;

    /**
     * Update timer.
     */
    private _updateTimer?: NodeJS.Timer;

    /**
     * Create a new instance of Reading.
     * @param props The props.
     */
    constructor(props: ReadingProps) {
        super(props);

        this._apiClient = ServiceFactory.get<ApiClient>("api-client");

        this.state = {
            confidenceScore: 0
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        await this.findData();
    }

    /**
     * The component is going to unmount.
     */
    public componentWillUnmount(): void {
        this.stopData();
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <div className="card margin-t-s">
                <div className="card--header card--header__space-between">
                    <h2>Reading Id: {this.props.sensorReading.reading_id}</h2>
                    <Spinner compact={true} />
                </div>
                <div className="card--content middle row">
                    <div className="reading">
                        <div className="card--label">
                            Data
                        </div>
                        <div className="card--value">
                            {this.props.sensorReading.data}
                        </div>
                        <div className="card--label">
                            Confidence Score
                        </div>
                        <div className="card--value">
                            {this.state.confidenceScore}
                        </div>
                        {this.state.readingAnnotations?.map((annotation, idx) => (
                            <div className="annotation" key={idx}>
                                <div className="col margin-r-s">
                                    <div className="card--label">
                                        Issuer
                                    </div>
                                    <div className="card--value">
                                        {annotation.payload.iss}
                                    </div>
                                </div>
                                <div className="col margin-r-s">
                                    <div className="card--label">
                                        Subject
                                    </div>
                                    <div className="card--value">
                                        {annotation.payload.sub}
                                    </div>
                                </div>
                                <div className="col margin-r-s">
                                    <div className="card--label">
                                        Issued At
                                    </div>
                                    <div className="card--value">
                                        {DateHelper.format(annotation.payload.iat)}
                                    </div>
                                </div>
                                <div className="col margin-r-s">
                                    <div className="card--label">
                                        Annotation
                                    </div>
                                    <div className="card--value">
                                        {annotation.payload.ann}
                                    </div>
                                </div>
                                <div className="col margin-r-s">
                                    <div className="card--label">
                                        Value
                                    </div>
                                    <div className="card--value">
                                        {annotation.payload.avl}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Find the data.
     */
    private async findData(): Promise<void> {
        await this.refreshData(true);
    }

    /**
     * Stop the data retrieval.
     */
    private stopData(): void {
        if (this._updateTimer) {
            clearTimeout(this._updateTimer);
            this._updateTimer = undefined;
        }
    }

    /**
     * Refresh the data.
     * @param forceStart Force the start.
     */
    private async refreshData(forceStart?: boolean): Promise<void> {
        if (this._updateTimer || forceStart) {
            const response1 = await this._apiClient.getAnnotations(this.props.sensorReading.reading_id);
            const response2 = await this._apiClient.getConfidenceScore(this.props.sensorReading.reading_id);

            this.setState({
                readingAnnotations: response1,
                confidenceScore: response2 ? response2.confidence_score : 0
            });

            if (this._updateTimer) {
                clearTimeout(this._updateTimer);
            }
            this._updateTimer = setTimeout(async () => this.refreshData(), 1000);
        }
    }
}

export default Reading;
