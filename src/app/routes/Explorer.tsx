import React, { Component, ReactNode } from "react";
import { ApiClient } from "../../clients/apiClient";
import { ServiceFactory } from "../../factories/serviceFactory";
import Reading from "../components/Reading";
import Spinner from "../components/Spinner";
import "./Explorer.scss";
import { ExplorerState } from "./ExplorerState";

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
            query: "",
            statusBusy: false,
            status: ""
        };
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <div className="explorer">
                <div className="wrapper">
                    <div className="inner">
                        <h1>Explorer</h1>
                        <div className="row">
                            <div className="cards">
                                <div className="card">
                                    <div className="card--header">
                                        <h2>Search</h2>
                                    </div>
                                    <div className="card--content">
                                        <div className="row middle margin-b-s row--tablet-responsive">
                                            <div className="card--label form-label-width">
                                                Sensor
                                            </div>
                                            <input
                                                type="text"
                                                value={this.state.query}
                                                onChange={e => this.setState(
                                                    { query: e.target.value }
                                                )}
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
                                                onClick={() => this.findData()}
                                                disabled={this.state.statusBusy || this.state.query.length === 0}
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
                                        <Reading sensorReading={s} />
                                    </React.Fragment>
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
        }, async () => {
            await this.refreshData();
        });
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
     * Refresh the data.
     */
    private async refreshData(): Promise<void> {
        if (this.state.statusBusy) {
            const response = await this._apiClient.getReadings(this.state.query);

            this.setState({
                sensorReadings: response
            });

            if (this._updateTimer) {
                clearTimeout(this._updateTimer);
            }
            this._updateTimer = setTimeout(async () => this.refreshData(), 1000);
        }
    }
}

export default Explorer;
