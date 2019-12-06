/*eslint-disable no-undef*/
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// SERVICES
// ==============================
import { fakeAuth } from './services/auth.service';
import { StateProvider } from './services/store';
import { UtilityService } from './services/utils.service';
import { ReactRouterGlobalHistory } from './services/global-history';

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
import { NoMatch } from './pages/NoMatch';

const utilityService = new UtilityService();

// ProtectedRoute HOC function to check if user is authenticated and login then route to component
// Else redirect to login page
const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        (sessionStorage.getItem('token') && sessionStorage.getItem('token') !== null)
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/login',
                state: {
                    from: props.location,
                    // prevLocation: path,
                    error: "You need to login first!",
                }
            }} />
    )} />
);

export const App = (props) => {
    console.log('App Props : ', props);

    useEffect(() => {
        let token = sessionStorage.getItem('token');
        sessionStorage.setItem('isSessionExtended', false);

        if (token && token !== null) {
            fakeAuth.authenticate();
        }

        utilityService.checkSessionExpiry(null, null);

    }, []);

    return (
        <StateProvider>
            <BrowserRouter>
                <ReactRouterGlobalHistory />
                <Header />

                <Switch>
                    <Route exact path="/" render={(props) => <Redirect to="/home" {...props} />} />
                    {/* <Route path="/home" component={Home} exact={true} /> */}
                    <Route path="/login" component={Login} exact={true} />
                    <Route path="/register" component={Register} exact={true} />
                    <Route path="/support" component={Support} exact={true} />
                    <Route path="/pricing" component={Pricing} exact={true} />
                    <ProtectedRoute path='/home' component={Home} />
                    <ProtectedRoute path='/about' component={AboutUs} />
                    <Route path="*" component={NoMatch} />
                </Switch>

                <Footer />
            </BrowserRouter>
        </StateProvider>
    );

}

export default App;
