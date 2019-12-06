import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';

// SERVICES
// ============================
// import { fakeAuth } from '../services/auth.service';
import { store } from '../services/store';
import { RemoteService } from '../services/remote.service';
import { UtilityService } from '../services/utils.service';

// CONSTANTS
// ============================
const remoteService = new RemoteService();
const utilityService = new UtilityService();

export const Login = (props) => {
    const signInFormRef = useRef(null);
    const [redirectToReferrer, setReferrer] = useState(false);
    const [wrongPasswordAttempts, setWrongPasswordAttempts] = useState(0);
    const [error, setError] = useState(null);

    const { state, dispatch } = useContext(store);

    const { from } = props.location.state || { from: { pathname: '/' } }

    // form submit
    const handleSubmit = (event) => {
        event.preventDefault();

        // Syntax : var formData = new FormData(form)
        // Ref : https://medium.com/@everdimension/how-to-handle-forms-with-just-react-ac066c48bd4f
        const form = event.target;
        const formData = new FormData(form);

        const formDataObj = {
            username: formData.get('inputEmail'),
            password: formData.get('inputPassword'),
            dateCreated: new Date(),
        };

        // Submit response to server
        // =====================================
        login(formDataObj)
    };

    const login = (formData) => {

        const options = {
            endPoint: `login`,
            restOfUrl: '?name=test',
            isSecure: true,
            contentType: 'application/json',
            requireAuthentication: false,
            body: formData,
        };

        remoteService.request('POST', options).then((data) => {
            console.log('Login Data :', data);
            if (data) {
                if (data.errorCode === 0) {
                    setError(data.errorCode)
                }
                if (data.token) {
                    // Set error message to null if data is available
                    dispatch({
                        type: 'UPDATE_MESSAGE',
                        message: null,
                        isLoggedIn: true
                    });

                    // Dispatch global event
                    dispatch({ type: 'LOGGED_IN', name: data.name, isLoggedIn: true });

                    // Store token in to sessionStorage
                    sessionStorage.setItem('token', data.token);

                    utilityService.checkSessionExpiry(dispatch, props.history);

                    setReferrer(true);

                    /* fakeAuth.authenticate(() => {
                        setReferrer(true);
                    }); */
                } else {

                    // Show error message sent by server
                    dispatch({
                        type: 'UPDATE_MESSAGE',
                        message: data.message,
                        isLoggedIn: false
                    });

                    // Remove token from sessionStorage (if any)
                    sessionStorage.removeItem('token');

                    // Reset sign-in form
                    signInFormRef.current.reset();

                    if (data.data && data.data.failedAttempt) {
                        setWrongPasswordAttempts(data.data.failedAttempt);
                    }
                }
            }
        });
    }

    useEffect(() => {
        // console.log('useEffect : ', fakeAuth.isAuthenticated, redirectToReferrer);
        // console.log('isAuthenticated :: ', state.isLoggedIn);
    }, [redirectToReferrer])

    /* if (fakeAuth.isAuthenticated || (sessionStorage.getItem('token') && sessionStorage.getItem('token') !== null)) {
        return <Redirect to={from} />
    } */

    // Hide login form if continuous wrong password attempt
    if (wrongPasswordAttempts > 3) {
        // return <div className="alert alert-danger" role="alert">Your account is locked due to wrong password. Please try after some time</div>;
    }

    if (redirectToReferrer) {
        return <Redirect to={from} />
    }

    return (
        <form className="form-signin" onSubmit={(event) => handleSubmit(event)} ref={signInFormRef}>

            {/* <b>redirectToReferrer :{redirectToReferrer.toString()}</b><br />
            <strong>isAuthenticated = {fakeAuth.isAuthenticated.toString()}</strong> */}

            {state.message ? <div className="alert alert-danger" role="alert">{state.message}</div> : null}
            {
                error === 0 ? <div className="alert alert-danger" role="alert">Your account does not exists with us. <Link to="/register">Create new account</Link> </div> : null

            }

            <img className="mb-4" src="/assets/images/bootstrap-solid.svg" alt="" width="72" height="72" />
            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>

            <label htmlFor="inputEmail" className="sr-only">Username</label>
            <input type="text" id="inputEmail" name="inputEmail" className="form-control" placeholder="Username or Email address" required={true} autoFocus={true} />

            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <input type="password" id="inputPassword" name="inputPassword" className="form-control" placeholder="Password" required={true} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" />

            <div className="checkbox mb-3">
                <label><input type="checkbox" value="remember-me" name="chkRememberMe" /> Remember me</label>
            </div>

            <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>

            <p className="p-2 text-center"><strong>Don't have an account? <Link to="/register">Register</Link></strong></p>

            <p className="p-2 text-center"><Link to="/register">Forget password?</Link></p>
        </form>
    )
}
