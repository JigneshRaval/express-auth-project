
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";

import * as serviceWorker from './serviceWorker';

// jQuery + Bootstrap
// ====================================
import './assets/css/bootstrap.css'
import './index.css';
import './App.css';

// import * as $ from 'jquery';
import 'jquery'
import 'bootstrap/dist/js/bootstrap.bundle';

// APP
import App from './App';

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
