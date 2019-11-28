
import React from 'react';
// import { Link } from 'react-router-dom';

export const Footer = () => {

    return (
        <div className="container">
            <footer className="pt-4 my-md-5 pt-md-5 border-top">
                <div className="row">
                    <div className="col-6 col-md">
                        <h5>Features</h5>
                        <ul className="list-unstyled text-small">
                            <li><a className="text-muted" href="/home">Cool stuff</a></li>
                            <li><a className="text-muted" href="/home">Random feature</a></li>
                            <li><a className="text-muted" href="/home">Team feature</a></li>
                            <li><a className="text-muted" href="/home">Stuff for developers</a></li>
                            <li><a className="text-muted" href="/home">Another one</a></li>
                            <li><a className="text-muted" href="/home">Last time</a></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md">
                        <h5>Resources</h5>
                        <ul className="list-unstyled text-small">
                            <li><a className="text-muted" href="/home">Resource</a></li>
                            <li><a className="text-muted" href="/home">Resource name</a></li>
                            <li><a className="text-muted" href="/home">Another resource</a></li>
                            <li><a className="text-muted" href="/home">Final resource</a></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md">
                        <h5>About</h5>
                        <ul className="list-unstyled text-small">
                            <li><a className="text-muted" href="/team">Team</a></li>
                            <li><a className="text-muted" href="/team">Locations</a></li>
                            <li><a className="text-muted" href="/team">Privacy</a></li>
                            <li><a className="text-muted" href="/team">Terms</a></li>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md">
                        <img className="mb-2" src="/docs/4.3/assets/brand/bootstrap-solid.svg" alt="" width="24" height="24" />
                        <small className="d-block mb-3 text-muted">© 2017-2019</small>
                    </div>
                </div>
            </footer>
        </div>
    )
}
