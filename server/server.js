const express = require('express');
const app = express(); // Export app for other routes to use
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3004;
let middleware = require('./middleware');

const authRoutes = require('./router/auth-routes');

/* Options route used for preflight request to the login POST route (cors) */
// https://picocoder.io/node-express-tutorial-part-5-user-authentication-jwt/
/* router.options("/*", (req, res, next) => {
    res.header('access-control-allow-origin', '*');
    res.header('access-control-allow-methods', 'POST');
    res.header('access-control-allow-headers', ' Accept, access-control-allow-origin, Content-Type');
    res.sendStatus(204);
}); */


// CORS middleware
// https://scotch.io/tutorials/vue-authentication-and-route-handling-using-vue-router
const allowCrossDomain = function (req, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', '*');
    response.header('Access-Control-Allow-Headers', '*');
    next();
}

// Middleware
// ==================================
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../')));

// Routes & Handlers
// ==================================
app.use('/api/v1', authRoutes);

// Check all the API routes for token
app.all('/api/v1/**', middleware.checkToken, (request, response) => {
    response.status(200).json({ message: 'Getting data from ' + request.url });
});

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
