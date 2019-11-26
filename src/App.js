import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import './assets/css/bootstrap.css'
import 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';

import './App.css';

// SERVICES
// ==============================
import { fakeAuth } from './services/auth.service';

// COMPONENTS
// ==============================
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// PAGES
// ==============================
import { Home } from './pages/Home';
import { AboutUs } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Support } from './pages/Support';
import { Pricing } from './pages/Pricing';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        fakeAuth.isAuthenticated === true
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} />
    )} />
);


function App() {
    return (
        <Router>
            <React.Fragment>
                <Header />

                <Switch>
                    <Route exact path="/" render={(props) => <Redirect to="/home" {...props} />} />
                    {/* <Route path="/home" component={Home} exact={true} /> */}
                    <Route path="/login" component={Login} exact={true} />
                    <Route path="/register" component={Register} exact={true} />
                    <Route path="/support" component={Support} exact={true} />
                    <Route path="/pricing" component={Pricing} exact={true} />
                    <PrivateRoute path='/home' component={Home} />
                    <PrivateRoute path='/about' component={AboutUs} />
                    {/* <Route path="*" component={NoMatch} /> */}
                </Switch>

                <Footer/>
            </React.Fragment>
        </Router>
    );
}

export default App;
