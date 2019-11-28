// 404 Error page

import React from 'react';
import { Link } from "react-router-dom";

export const NoMatch = () => {
    return (
        <div className="notfound">
            <div className="notfound-404">
                <h1>4<span>0</span>4</h1>
            </div>
            <h2>the page you requested could not found</h2>
            <Link to="/" className="uk-button uk-button-secondary">Take me back</Link>
        </div>
    );
}
