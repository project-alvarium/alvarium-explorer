import React, { Component, ReactNode } from "react";
import { Link } from "react-router-dom";
import logoHeader from "../../assets/logo-header.svg";
import "./Header.scss";

/**
 * Component which will show the header.
 */
class Header extends Component {
    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <header>
                <nav className="inner">
                    <Link to="/">
                        <img className="logo-image" src={logoHeader} alt="Alvarium" />
                    </Link>
                    <h1>Alvarium</h1>
                </nav>
            </header>
        );
    }
}

export default Header;
