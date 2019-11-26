import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { fakeAuth } from '../services/auth.service';

export const Login = (props) => {

    const API_URL = 'http://localhost:3004';
    const [redirectToReferrer, setReferrer] = useState(false);

    const { from } = props.location.state || { from: { pathname: '/' } }

    // Handle Html to Markdown form submit
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
        const token = sessionStorage.getItem('token')

        console.log('Token : ', token);
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
                    return;
                }

                // Examine the text in the response
                // this.articles = response.json();
                return response.json();
            }).then(data => {
                console.log('login DATA :', data);
                if (data) {
                    if (data.token) {
                        sessionStorage.setItem('token', data.token);
                    }
                }

                fakeAuth.authenticate(() => {
                    if (token) {
                        setReferrer(true);
                    }
                });

            });
    }

    useEffect(() => {

    }, [])

    if (fakeAuth.isAuthenticated === true) {
        return <Redirect to={from} />
    }

    if (redirectToReferrer === true) {
        return <Redirect to={from} />
    }
    return (
        <form className="form-signin" onSubmit={(event) => handleSubmit(event)}>
            <img className="mb-4" src="/docs/4.3/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72" />
            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>

            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input type="text" id="inputEmail" name="inputEmail" className="form-control" placeholder="Email address" required="" autoFocus="" />

            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <input type="password" id="inputPassword" name="inputPassword" className="form-control" placeholder="Password" required="" />

            <div className="checkbox mb-3">
                <label><input type="checkbox" value="remember-me" name="chkRememberMe" /> Remember me</label>
            </div>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
            <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            <p className="mt-5 mb-3 text-muted">© 2017-2019</p>
        </form>
    )
}
