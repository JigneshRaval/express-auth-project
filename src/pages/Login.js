import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';

// SERVICES
// ============================
import { fakeAuth } from '../services/auth.service';
import { store } from '../services/store';

// CONSTANTS
// ============================
const API_URL = 'http://localhost:3004/api/v1';

export const Login = (props) => {
    const signInFormRef = useRef(null);
    const [redirectToReferrer, setReferrer] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

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

        window.fetch(`${API_URL}/login`, {
            method: 'POST',
            body: JSON.stringify(formData),
            mode: 'cors',
            // redirect: 'follow',
            headers: new Headers({
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`
                //"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            })
        })
            .then((response) => {
                // If error then exit
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    // Show error message sent by server
                    setErrorMessage('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }

                return response.json();
            }).then(data => {
                if (data) {
                    if (data.token) {
                        // Set error message to null if data is available
                        setErrorMessage(null);

                        // Store token in to sessionStorage
                        sessionStorage.setItem('token', data.token);

                        // Dispatch global event
                        dispatch({ type: 'LOGGED_IN', name: data.name });

                        fakeAuth.authenticate(() => {
                            setReferrer(true);
                        });
                    } else {
                        // Show error message sent by server
                        setErrorMessage(data.message);

                        // Reset sign-in form
                        signInFormRef.current.reset();
                    }
                }
            });
    }

    useEffect(() => {
        // console.log('useEffect : ', fakeAuth.isAuthenticated, redirectToReferrer);
    }, [redirectToReferrer])

    if (fakeAuth.isAuthenticated || (sessionStorage.getItem('token') && sessionStorage.getItem('token') !== null)) {
        return <Redirect to={from} />
    }

    if (redirectToReferrer) {
        return <Redirect to={from} />
    }
    return (
        <form className="form-signin" onSubmit={(event) => handleSubmit(event)} ref={signInFormRef}>

            {/* <b>redirectToReferrer :{redirectToReferrer.toString()}</b><br />
            <strong>isAuthenticated = {fakeAuth.isAuthenticated.toString()}</strong> */}

            {errorMessage ? <div className="alert alert-danger" role="alert">{errorMessage}</div> : null}

            <img className="mb-4" src="/assets/images/bootstrap-solid.svg" alt="" width="72" height="72" />
            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>

            <label htmlFor="inputEmail" className="sr-only">Username</label>
            <input type="text" id="inputEmail" name="inputEmail" className="form-control" placeholder="Username or Email address" required={true} autoFocus="" />

            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <input type="password" id="inputPassword" name="inputPassword" className="form-control" placeholder="Password" required={true} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" />

            <div className="checkbox mb-3">
                <label><input type="checkbox" value="remember-me" name="chkRememberMe" /> Remember me</label>
            </div>

            <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>

            <p className="p-2 text-center"><strong>Don't have an account? <Link to="/register">Register</Link></strong></p>
        </form>
    )
}
