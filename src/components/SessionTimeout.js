import React from 'react';
import { withRouter } from 'react-router-dom';

import * as $ from 'jquery'

// SERVICES
// ============================
// import { fakeAuth } from '../services/auth.service';
// import { store } from '../services/store';
import { RemoteService } from '../services/remote.service';
import { UtilityService } from '../services/utils.service';

// COMPONENTS
// ============================

// CONSTANTS
// ============================
const remoteService = new RemoteService();
const utilityService = new UtilityService();

const sessionTimeout = (props) => {
    const { history, dispatch } = props;

    const extendSession = () => {
        // make a service call to refresh the token
        console.log('Extend Session called...');
        sessionStorage.setItem('isSessionExtended', true);

        const options = {
            endPoint: `refreshToken`,
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
                    console.log('Refresh token :', data);
                    if (data.token) {
                        // Store token in to sessionStorage
                        sessionStorage.setItem('token', data.token);

                        // If token is refreshed then reset session counter
                        utilityService.resetSessionCounter();
                    }
                }
            }
        });
    }

    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Modal content</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={extendSession}>Extend Session</button>
                        <button type="button" className="btn btn-primary" onClick={() => {
                            dispatch({ type: 'LOGGED_OUT' });
                            history.push('/login');
                            $('#exampleModal').modal('hide');
                        }}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const SessionTimeout = withRouter(sessionTimeout);
