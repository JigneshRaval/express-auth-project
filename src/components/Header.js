import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

// SERVICES
// ============================
// import { fakeAuth } from '../services/auth.service';
import { store } from '../services/store';

// COMPONENTS
// ============================
import { SignOutButton } from './LogoutButton';

export const Header = () => {
    const globalState = useContext(store);
    const { state, dispatch } = globalState;

    return (
        <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
            <h5 className="my-0 mr-md-auto font-weight-normal">Company name</h5>
            <nav className="my-2 my-md-0 mr-md-3">
                <Link to="/home" className="p-2 text-dark">Dashboard</Link>
                <Link to="/about" className="p-2 text-dark">About Us</Link>
                <Link to="/support" className="p-2 text-dark">Support</Link>
                <Link to="/pricing" className="p-2 text-dark">Pricing</Link>
                {
                    state.isLoggedIn || (sessionStorage.getItem('token') && sessionStorage.getItem('token') !== null) ? <SignOutButton dispatch={dispatch} name={state.name} /> : <Link to="/login" className="btn btn-outline-primary">Login</Link>
                }
            </nav>
        </div>
    )
}
