import React from 'react';
import { withRouter } from 'react-router-dom';

// SERVICES
// ============================
// import { fakeAuth } from '../services/auth.service';

export const SignOutButton = withRouter(({ history, dispatch, name }) => {
    return (
        <React.Fragment>
            Welcome {name}! <button className="btn btn-outline-primary" onClick={() => {
                dispatch({ type: 'LOGGED_OUT' });
                history.push('/login');
            }}>Sign out</button>
        </React.Fragment>
    );
});
