import React, { useContext } from 'react';

// SERVICES
// ============================
// import { fakeAuth } from '../services/auth.service';
import { store } from '../services/store';
import { RemoteService } from '../services/remote.service';

// CONSTANTS
// ============================
const remoteService = new RemoteService();

export const Pricing = (props) => {
    const { dispatch } = useContext(store);

    const fetchUsers = () => {

        const options = {
            endPoint: `pricing`,
            restOfUrl: '?name=test',
            isSecure: true,
            contentType: 'application/json',
            requireAuthentication: true
        };

        remoteService.request('GET', options).then((data) => {
            if (data) {
                // If token is expired then redirect to login page
                if (data.message && (data.message === 'jwt expired' || data.message === 'jwt malformed')) {
                    dispatch({
                        type: 'UPDATE_MESSAGE',
                        message: 'Your login session has expired. Please login again.',
                        isLoggedIn: false
                    });

                    // Trigger logOut event
                    dispatch({ type: 'LOGGED_OUT' });

                    // Redirect to logOut page
                    props.history.push('/login');

                } else {
                    console.log('Pricing Data :', data);
                }
            }
        });
    }

    return (
        <section className="pricing-section">
            <button type="button" className="btn btn-lg btn-block btn-primary" onClick={fetchUsers}>Fetch Users</button>

            <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                <h1 className="display-4">Pricing</h1>
                <p className="lead">Quickly build an effective pricing table for your potential customers with this Bootstrap example. It’s built with default Bootstrap components and utilities with little customization.</p>
            </div>

            <div className="container">
                <div className="card-deck mb-3 text-center">
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header">
                            <h4 className="my-0 font-weight-normal">Free</h4>
                        </div>
                        <div className="card-body">
                            <h1 className="card-title pricing-card-title">$0 <small className="text-muted">/ mo</small></h1>
                            <ul className="list-unstyled mt-3 mb-4">
                                <li>10 users included</li>
                                <li>2 GB of storage</li>
                                <li>Email support</li>
                                <li>Help center access</li>
                            </ul>
                            <button type="button" className="btn btn-lg btn-block btn-outline-primary">Sign up for free</button>
                        </div>
                    </div>
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header">
                            <h4 className="my-0 font-weight-normal">Pro</h4>
                        </div>
                        <div className="card-body">
                            <h1 className="card-title pricing-card-title">$15 <small className="text-muted">/ mo</small></h1>
                            <ul className="list-unstyled mt-3 mb-4">
                                <li>20 users included</li>
                                <li>10 GB of storage</li>
                                <li>Priority email support</li>
                                <li>Help center access</li>
                            </ul>
                            <button type="button" className="btn btn-lg btn-block btn-primary">Get started</button>
                        </div>
                    </div>
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header">
                            <h4 className="my-0 font-weight-normal">Enterprise</h4>
                        </div>
                        <div className="card-body">
                            <h1 className="card-title pricing-card-title">$29 <small className="text-muted">/ mo</small></h1>
                            <ul className="list-unstyled mt-3 mb-4">
                                <li>30 users included</li>
                                <li>15 GB of storage</li>
                                <li>Phone and email support</li>
                                <li>Help center access</li>
                            </ul>
                            <button type="button" className="btn btn-lg btn-block btn-primary">Contact us</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
