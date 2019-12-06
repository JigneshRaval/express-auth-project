// https://github.com/Tomekmularczyk/react-router-global-history
// This is a simple helper library to live alongside react-router-4 to help you access
// history object from the wherever file in your application(like in redux actions).
import React from 'react';
import { withRouter } from 'react-router';

let globalHistory = null;

class Spy extends React.Component {
    constructor(props) {
        super(props);
        globalHistory = props.history;
    }

    render() {
        return null;
    }
}

// simply need to mount component on top of your application:
export const ReactRouterGlobalHistory = withRouter(Spy);

export default function getHistory() {
    if (!globalHistory) {
        throw new Error('No history Object. You probably forgot to mount ReactRouterGlobalHistory from this package.');
    }

    return globalHistory;
}
