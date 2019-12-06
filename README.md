# Routes and API Authentication using JWT and Express.js

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### This project will help to understand following things

- How to protect route on client side using JWT token

    Tutorial:

    1. [Protected routes and authentication with React Router v4](https://tylermcginnis.com/react-router-protected-routes-authentication/)

    2. [Create a ProtectedRoute for Logged In Users with Route, Redirect, and a Render Prop in React Router](https://codedaily.io/tutorials/49/Create-a-ProtectedRoute-for-Logged-In-Users-with-Route-Redirect-and-a-Render-Prop-in-React-Router)

- How to use JWT to generate token on Login and Register using Express.js

- How to use Node.js Crypto module to encrypt/decrypt password

    Tutorial:

    1. [Node JS | Password Hashing with Crypto module](https://www.geeksforgeeks.org/node-js-password-hashing-crypto-module/)

- How to use React Context and useReducer Hooks to create global store

    Tutorial:

    1. [Use Hooks + Context, not React + Redux](https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/)

**TODO:**

- [ ]  Implement maximum wrong password attempt

    **Requirements**
    - A user's account should be "locked" after some number of consecutive failed login attempts
    - A user's account should become unlocked once a sufficient amount of time has passed
    - The User model should expose the reason for a failed login attempt to the application (though not necessarily to the end user)

- [ ]  Implement forgot password flow

- [ ]  Implement reset password flow

- [ ]  Implement email verification for forgot/reset password

- [ ]  Implement Admin and Super Admin UI interface

- [ ]  Implement Session expire warning message popup

### **Frontend**

- React
- Bootstrap + jQuery

### **Backend**

- Node.js
- Express.js
- JWT
- Crypto Module from Node.js
