/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { ApiClient } from "./clients/apiClient";
import { ServiceFactory } from "./factories/serviceFactory";
import "./index.scss";
import { IConfiguration } from "./models/IConfiguration";

const config: IConfiguration = require("./assets/config/config.json");

initServices()
    .then(() => {
        ReactDOM.render(
            (
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            ),
            document.querySelector("#root")
        );
    })
    .catch(err => console.error(err));

/**
 * Initialise the services.
 */
async function initServices(): Promise<void> {
    ServiceFactory.register("api-client", () => new ApiClient(config.apiEndpoint, config.simulatorEndpoint));
}
