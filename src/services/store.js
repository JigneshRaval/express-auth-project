// store.js

// Implemented global store using useContext and useReducer
// Ref : https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/
import React, { createContext, useReducer } from 'react';

const initialState = {
    isLoggedIn: false,
    message: '',
    name: ''
};

const store = createContext(initialState); // authContext or global Store to store values
const { Provider } = store;

const StateProvider = ({ children }) => {

    const [state, dispatch] = useReducer((state, action) => {

        switch (action.type) {
            case 'LOGGED_IN':
                console.log('Reducer action :', action);
                return {
                    ...state,
                    isLoggedIn: true,
                    name: action.name
                }
            case 'LOGGED_OUT':
                console.log('Reducer action :', action);
                sessionStorage.removeItem('token');
                return {
                    ...state,
                    isLoggedIn: false,
                    name: ''
                }
            case 'UPDATE_MESSAGE':
                console.log('Reducer action :', action);
                return {
                    ...state,
                    message: action.message,
                    isLoggedIn: action.isLoggedIn,
                }
            default:
                console.log('Reducer action default :', action);
                // throw new Error();
                return state;
        }

    }, initialState);

    return (
        <Provider value={{ state, dispatch }}>
            {children}
        </Provider>
    );
};

export { store, StateProvider }
