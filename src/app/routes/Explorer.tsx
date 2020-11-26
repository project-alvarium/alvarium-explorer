import React, { Component, ReactNode } from "react";
import { ApiClient } from "../../clients/apiClient";
import { ServiceFactory } from "../../factories/serviceFactory";
import { DateHelper } from "../../helpers/dateHelper";
import { IConfiguration } from "../../models/IConfiguration";
import Reading from "../components/Reading";
import Spinner from "../components/Spinner";
import "./Explorer.scss";
import { ExplorerState } from "./ExplorerState";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const config: IConfiguration = require("../../assets/config/config.json");

/**
 * Explorer panel.
 */
class Explorer extends Component<unknown, ExplorerState> {
    /**
     * API Client.
     */
    private readonly _apiClient: ApiClient;

    /**
     * Update timer.
     */
    private _updateTimer?: NodeJS.Timer;

    /**
     * Create a new instance of Explorer.
     * @param props The props.
     */
    constructor(props: unknown) {
        super(props);

        this._apiClient = ServiceFactory.get<ApiClient>("api-client");

        this.state = {
            sensor: "",
            query: {
                iss: null,
                sub: null,
                iat: null,
                jti: null,
                ann: null
            },
            statusBusy: false,
            status: ""
        };
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        const sensors = [];
        let i = 0;
        for (i; i < config.sensorIds.length; i++) {
            const sensorId = config.sensorIds[i];
            sensors.push(
                <button
                    type="button"
                    className="form-button selected margin-r-t margin-b-t"
                    onClick={() => {
                        this.setState({ sensor: sensorId });
                        this.findData();
                    }}
                    disabled={this.state.statusBusy}
                >
                    {sensorId}
                </button>
            );
        }
        return (
            <div className="explorer">
                <div className="wrapper">
                    <div className="inner">
                        <h1>Explorer</h1>
                        <div className="row">
                            <div className="cards">
                                <div className="card">
                                    <div className="card--header">
                                        <h2>Sensors</h2>
                                    </div>
                                    <div className="card--content">
                                        <div className="row center margin-b-s row--tablet-responsive">
                                            {sensors}
                                        </div>
                                        <div className="row center margin-b-s row--tablet-responsive">
                                            <button
                                                type="button"
                                                className="form-button selected margin-r-t margin-b-t"
                                                onClick={() => this.stopData()}
                                                disabled={!this.state.statusBusy}
                                            >
                                                Stop
                                            </button>
                                            <button
                                                type="button"
                                                className="form-button selected margin-r-t margin-b-t"
                                                onClick={() => this.clearData()}
                                                disabled={this.state.statusBusy}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.state.status && this.state.sensorReadings === undefined && (
                            <div className="card margin-t-s">
                                <div className="card--content middle row">
                                    {this.state.statusBusy && (<Spinner />)}
                                    <p className="status">
                                        {this.state.status}
                                    </p>
                                </div>
                            </div>
                        )}
                        {this.state.sensorReadings?.length === 0 && (
                            <div className="card margin-t-s">
                                <div className="card--content middle row">
                                    <p>There are no readings for the sensor.</p>
                                </div>
                            </div>
                        )}
                        {this.state.sensorReadings?.map((s, idx) => (
                            <React.Fragment key={idx}>
                                <Reading
                                    sensorReading={s}
                                    isActive={this.state.statusBusy}
                                />
                            </React.Fragment>
                        ))}
                        <div className="row">
                            <div className="cards">
                                <div className="card margin-t-m">
                                    <div className="card--header">
                                        <h2>Filtered Search</h2>
                                    </div>
                                    <div className="card--content">
                                        <div className="row middle margin-b-s row--tablet-responsive">
                                            <div className="card--label form-label-width">
                                                Issuer
                                            </div>
                                            <input
                                                type="text"
                                                value={this.state.query.iss ? this.state.query.iss : ""}
                                                onChange={e => {
                                                    const query = this.state.query;
                                                    query.iss = e.target.value;
                                                    this.setState({ query });
                                                }}
                                                disabled={this.state.statusBusy}
                                                className="form-input-long"
                                            />
                                        </div>
                                        <div className="row middle margin-b-s row--tablet-responsive">
                                            <div className="card--label form-label-width">
                                                Subject
                                            </div>
                                            <input
                                                type="text"
                                                value={this.state.query.sub ? this.state.query.sub : ""}
                                                onChange={e => {
                                                    const query = this.state.query;
                                                    query.sub = e.target.value;
                                                    this.setState({ query });
                                                }}
                                                disabled={this.state.statusBusy}
                                                className="form-input-long"
                                            />
                                        </div>
                                        <div className="row middle margin-b-s row--tablet-responsive">
                                            <div className="card--label form-label-width">
                                                Issued At
                                            </div>
                                            <input
                                                type="text"
                                                value={this.state.query.iat ? this.state.query.iat : ""}
                                                onChange={e => {
                                                    const query = this.state.query;
                                                    query.iat = Number(e.target.value);
                                                    this.setState({ query });
                                                }}
                                                disabled={this.state.statusBusy}
                                                className="form-input-long"
                                            />
                                        </div>
                                        <div className="row middle margin-b-s row--tablet-responsive">
                                            <div className="card--label form-label-width">
                                                Json Token Id
                                            </div>
                                            <input
                                                type="text"
                                                value={this.state.query.jti ? this.state.query.jti : ""}
                                                onChange={e => {
                                                    const query = this.state.query;
                                                    query.jti = e.target.value;
                                                    this.setState({ query });
                                                }}
                                                disabled={this.state.statusBusy}
                                                className="form-input-long"
                                            />
                                        </div>
                                        <div className="row middle margin-b-s row--tablet-responsive">
                                            <div className="card--label form-label-width">
                                                Annotation Type
                                            </div>
                                            <input
                                                type="text"
                                                value={this.state.query.ann ? this.state.query.ann : ""}
                                                onChange={e => {
                                                    const query = this.state.query;
                                                    query.ann = e.target.value;
                                                    this.setState({ query });
                                                }}
                                                disabled={this.state.statusBusy}
                                                className="form-input-long"
                                            />
                                        </div>
                                        <div className="row margin-b-s row--tablet-responsive">
                                            <div className="card--label form-label-width">
                                                &nbsp;
                                            </div>
                                            <button
                                                type="button"
                                                className="form-button selected margin-r-t margin-b-t"
                                                onClick={() => this.filterAnnotations()}
                                                disabled={
                                                    this.state.statusBusy || (
                                                        this.state.query.iss === null &&
                                                        this.state.query.sub === null &&
                                                        this.state.query.iat === null &&
                                                        this.state.query.jti === null &&
                                                        this.state.query.ann === null
                                                    )
                                                }
                                            >
                                                Find Data
                                            </button>
                                            <button
                                                type="button"
                                                className="form-button selected margin-r-t margin-b-t"
                                                onClick={() => this.stopData()}
                                                disabled={!this.state.statusBusy}
                                            >
                                                Stop
                                            </button>
                                            <button
                                                type="button"
                                                className="form-button selected margin-r-t margin-b-t"
                                                onClick={() => this.clearAnnotations()}
                                                disabled={this.state.statusBusy}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {this.state.status && this.state.readingAnnotations === undefined && (
                                    <div className="card margin-t-s">
                                        <div className="card--content middle row">
                                            {this.state.statusBusy && (<Spinner />)}
                                            <p className="status">
                                                {this.state.status}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {this.state.readingAnnotations?.length === 0 && (
                                    <div className="card margin-t-s">
                                        <div className="card--content middle row">
                                            <p>There are no annotations with these filters.</p>
                                        </div>
                                    </div>
                                )}

                                {this.state.readingAnnotations?.map((annotation, idx) => (
                                    <div className="card margin-t-s" key={idx}>
                                        <div className="card--header card--header__space-between">
                                            <h2>Annotation: {annotation.payload.jti}</h2>
                                            <Spinner compact={true} />
                                        </div>
                                        <div className="card--content middle row">
                                            <div className="annotation" >
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
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Find the data.
     */
    private findData(): void {
        this.setState({
            statusBusy: true,
            status: "Looking for data...",
            sensorReadings: undefined
        }, () => {
            this._updateTimer = setInterval(async () => this.refreshData(), 1000);
        });
    }

    /**
     * Clear readings from state
     */
    private clearData(): void {
        this.setState({ sensorReadings: undefined });
    }

    /**
     * Clear annotations from state
     */
    private clearAnnotations(): void {
        this.setState({ readingAnnotations: undefined });
    }

    /**
     * Stop the data retrieval.
     */
    private stopData(): void {
        if (this._updateTimer) {
            clearTimeout(this._updateTimer);
            this._updateTimer = undefined;
        }
        this.setState({ statusBusy: false, status: "" });
    }

    /**
     * Filter annotations in console
     */
    private filterAnnotations(): void {
        this.setState({
            statusBusy: true,
            status: "Fitering Annotations...",
            sensorReadings: undefined
        }, () => {
           this._updateTimer = setInterval(async () => this.refreshAnnotations(), 1000);
        });
    }

    /**
     * Refresh the data.
     */
    private async refreshData(): Promise<void> {
        const response = await this._apiClient.getReadings(this.state.sensor);

        this.setState({
            sensorReadings: response
        });
    }

    /**
     * Refresh filtered annotations.
     */
    private async refreshAnnotations(): Promise<void> {
        const response = await this._apiClient.filterAnnotations(this.state.query);
        this.setState({
            readingAnnotations: response
        });
    }
}

export default Explorer;
