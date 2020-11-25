import React, { Component, ReactNode } from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import "./App.scss";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Explorer from "./routes/Explorer";

/**
 * Main application class.
 */
class App extends Component<RouteComponentProps> {
    /**
     * Create a new instance of App.
     * @param props The props.
     */
    constructor(props: RouteComponentProps) {
        super(props);

        this.state = {
        };
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <div className="app col">
                <Header />
                <div className="col fill">
                    <Switch>
                        <Route
                            path="/"
                            component={() => (<Explorer />)}
                        />
                    </Switch>
                </div>
                <Footer dynamic={[
                    {
                        label: "Explorer",
                        url: ""
                    }
                ]}
                />
            </div>
        );
    }
}

export default withRouter(App);
