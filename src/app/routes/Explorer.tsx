/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import React, { Component, ReactNode } from "react";
import { ApiClient } from "../../clients/apiClient";
import { ServiceFactory } from "../../factories/serviceFactory";
import { DateHelper } from "../../helpers/dateHelper";
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
            sensor: "",
            startAddress: "",
            query: {
                iss: null,
                sub: null,
                iat: null,
                jti: null,
                ann: null
            },
            subReq: {
                Node: "http://localhost:14265",
                Address: "",
                TickRate: 3,
                Id: "SensorId"
            },
            sensors: [],
            firstRun: true,
            statusBusy: false,
            status: ""
        };
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    componentDidMount(): void {
        this.getStartAddress();
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
                                        <h2>Sensors</h2>
                                    </div>
                                    <div className="card--content">
                                        <div className="row middle margin-b-s row--tablet-responsive">
                                            <div className="card--label form-label-width">
                                                Sensor Id
                                            </div>
                                            <input
                                                type="text"
                                                value={this.state.subReq.Id ? this.state.subReq.Id : ""}
                                                onChange={e => {
                                                    const subReq = this.state.subReq;
                                                    subReq.Id = e.target.value;
                                                    this.setState({ subReq });
                                                }}
                                                disabled={this.state.statusBusy}
                                                className="form-input-long"
                                            />
                                        </div>

                                        <div className="row middle margin-b-s row--tablet-responsive">
                                            <div className="card--label form-label-width">
                                                Address
                                            </div>
                                            <input
                                                type="text"
                                                value={this.state.startAddress ? this.state.startAddress : ""}
                                                onChange={e => {
                                                    const subReq = this.state.subReq;
                                                    subReq.Address = e.target.value;
                                                    this.setState({
                                                        startAddress: e.target.value,
                                                        subReq
                                                    });
                                                }}
                                                disabled={this.state.statusBusy}
                                                className="form-input-long"
                                            />
                                        </div>

                                        <div className="row middle margin-b-s row--tablet-responsive">
                                            <div className="card--label form-label-width">
                                                Node Url
                                            </div>
                                            <input
                                                type="text"
                                                value={this.state.subReq.Node ? this.state.subReq.Node : ""}
                                                onChange={e => {
                                                    const subReq = this.state.subReq;
                                                    subReq.Node = e.target.value;
                                                    this.setState({ subReq });
                                                }}
                                                disabled={this.state.statusBusy}
                                                className="form-input-long"
                                            />
                                        </div>
                                        <div className="row middle margin-b-s row--tablet-responsive">
                                            <div className="card--label form-label-width">
                                                Tick Rate
                                            </div>
                                            <input
                                                type="text"
                                                value={this.state.subReq.TickRate ? this.state.subReq.TickRate : ""}
                                                onChange={e => {
                                                    const subReq = this.state.subReq;
                                                    subReq.TickRate = Number(e.target.value);
                                                    this.setState({ subReq });
                                                }}
                                                disabled={this.state.statusBusy}
                                                className="form-input-long"
                                            />
                                        </div>
                                        <div className="row margin-b-s row--tablet-responsive">
                                            <div className="card--label form-label-width">
                                                &nbsp;
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card--content">

                                        <div className="row center margin-b-s row--tablet-responsive">
                                            {this.state.sensors?.map((id, index) => (
                                                <button
                                                    type="button"
                                                    key={index}
                                                    className="form-button selected margin-r-t margin-b-t"
                                                    onClick={() => {
                                                        this.setState({ sensor: id });
                                                        this.findData();
                                                    }}
                                                    disabled={this.state.statusBusy}
                                                >
                                                    {id}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="row center margin-b-s row--tablet-responsive">
                                            <button
                                                type="button"
                                                className="form-button selected margin-r-t margin-b-t"
                                                onClick={() => {
this.addSub();
}}
                                                disabled={this.state.statusBusy || this.state.subReq.Address === ""}
                                            >
                                                Add Sensor
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
        this.setState({
            sensorReadings: undefined,
            sensors: []
        });
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

    private addSub(): void {
        const id = this.state.subReq.Id;
        this.setState({
            statusBusy: true,
            status: "Adding new sensor..."
        }, async () => {
            await this.sendReqs().then(_resp => {
                console.log("Adding to sensor list:", id);
                const sensorList = this.state.sensors;
                sensorList?.push(id);

                this.setState({
                    sensors: sensorList,
                    status: "Sensor added",
                    statusBusy: false
                });
            });
        });
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

    private getStartAddress(): void {
        const addr = "";
        this.setState({
            startAddress: addr,
            status: "Fetching Address..."
        }, async () => {
            await this._apiClient.fetchAddress().then(address => {
                if (address !== undefined) {
                    // eslint-disable-next-line no-new-object
                    const ann = address.announcement_id;
                    const subReq = this.state.subReq;
                    subReq.Address = ann;

                    console.log(ann);

                    this.setState({
                        startAddress: ann,
                        status: "Address set",
                        subReq
                    });
                }
            });
        });
    }

    private async sendReqs(): Promise<void> {
        const sensorQuery = { ...this.state.subReq };
        console.log("adding a new sensor");
        await this._apiClient.addNewSub(sensorQuery, "sensors");
        if (this.state.firstRun) {
            this.setState({ status: "Spawning Annotator..." });
            sensorQuery.Id = "Annotators";
            sensorQuery.TickRate = 5;
            console.log("adding a new annotator");
            await this._apiClient.addNewSub(sensorQuery, "annotators");
            this.setState({ status: "Annotator spawned...", firstRun: false });
        }
    }
}

export default Explorer;
