import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';

// SERVICES
// ============================
import { fakeAuth } from '../services/auth.service';
import { store } from '../services/store';

// CONSTANTS
// ============================
const API_URL = 'http://localhost:3004/api/v1';

export const Register = (props) => {

    const { state, dispatch } = useContext(store);

    const { from } = props.location.state || { from: { pathname: '/' } }

    // Handle Html to Markdown form submit
    const handleSubmit = (event) => {
        event.preventDefault();

        // Syntax : var formData = new FormData(form)
        // Ref : https://medium.com/@everdimension/how-to-handle-forms-with-just-react-ac066c48bd4f
        const form = event.target;
        const formData = new FormData(form);

        const formDataObj = {
            admin: false,
            isEmailVerified: false,
            name: formData.get('inputName'),
            email: formData.get('inputEmail'),
            username: formData.get('inputUsername'),
            password: formData.get('inputPassword'),
            dateCreated: new Date(),
        };

        // Submit response to server
        // =====================================
        register(formDataObj);
        props.history.push('/home');
    };

    const register = (formData) => {
        window.fetch(`${API_URL}/register`, {
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
                if (data && data.token) {
                    sessionStorage.setItem('token', data.token);
                }

                const token = sessionStorage.getItem('token');

                dispatch({ type: 'LOGGED_IN', name: data.name });

                fakeAuth.authenticate(() => {
                    console.log('Authenticated for new user.')
                    /* if (token) {
                        setReferrer(true);
                    } */
                });
            });
    }

    if (fakeAuth.isAuthenticated === true) {
        return <Redirect to={from} />
    }

    return (
        <form className="form-register" onSubmit={(event) => handleSubmit(event)}>
            <img className="mb-4" src="/docs/4.3/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72" />
            <h1 className="h3 mb-3 font-weight-normal">Please Register</h1>

            <div className="form-group">
                <label htmlFor="inputName">Name</label>
                <input type="text" id="inputName" name="inputName" className="form-control" placeholder="Name" required="" autoFocus="" />
            </div>

            <div className="form-group">
                <label htmlFor="inputEmail">Email address</label>
                <input type="email" id="inputEmail" name="inputEmail" className="form-control" placeholder="Email address" required="" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
            </div>

            <div className="form-group">
                <label htmlFor="inputUsername">Username</label>
                <input type="text" id="inputUsername" name="inputUsername" className="form-control" placeholder="Username" required="" />
            </div>

            <div className="form-group">
                <label htmlFor="inputPassword">Password</label>
                <input type="password" id="inputPassword" name="inputPassword" className="form-control" placeholder="Password" required="" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" />
            </div>

            <button className="btn btn-lg btn-primary btn-block" type="submit">Register</button>

            <p className="p-2 text-center"><strong>Already have an account? <Link to="/login">Login</Link></strong></p>
        </form>
    )
}
