import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import * as $ from 'jquery'

// SERVICES
// ============================
// import { fakeAuth } from '../services/auth.service';
import { store } from '../services/store';
import getHistory from '../services/global-history';

// COMPONENTS
// ============================
import { SignOutButton } from './LogoutButton';
import { SessionTimeout } from './SessionTimeout';

export const Header = () => {
    const { state, dispatch } = useContext(store);

    useEffect(() => {

        // Show session timeout modal dialog and dispatch logOut event if user doesn't click on "Extend Session" button
        $('#exampleModal').on('shown.bs.modal', (e) => {
            setTimeout(() => {
                let isSessionExtended = sessionStorage.getItem('isSessionExtended');
                if (isSessionExtended && isSessionExtended !== 'true') {
                    dispatch({ type: 'LOGGED_OUT' });
                    getHistory().push('/login');
                    $('#exampleModal').modal('hide');
                    sessionStorage.setItem('isSessionExtended', 'false');
                }
            }, 10000);
        });

    });

    return (
        <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
            <h5 className="my-0 mr-md-auto font-weight-normal">Company name</h5>
            <nav className="my-2 my-md-0 mr-md-3">
                <Link to="/home" className="p-2 text-dark" title="Protected Route">Dashboard</Link>
                <Link to="/about" className="p-2 text-dark" title="Protected Route">About Us</Link>
                <Link to="/support" className="p-2 text-dark">Support</Link>
                <Link to="/pricing" className="p-2 text-dark">Pricing</Link>
                {
                    state.isLoggedIn || (sessionStorage.getItem('token') && sessionStorage.getItem('token') !== null) ? <SignOutButton dispatch={dispatch} name={state.name} /> : <Link to="/login" className="btn btn-outline-primary">Login</Link>
                }
            </nav>
            {
                state.isLoggedIn || (sessionStorage.getItem('token') && sessionStorage.getItem('token') !== null) ? <SessionTimeout dispatch={dispatch} /> : null
            }
        </div>
    )
}
