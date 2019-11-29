// server/router/auth-routes.js

// Implemented Node.js Crypto module to hash/salt password
// Ref : https://www.geeksforgeeks.org/node-js-password-hashing-crypto-module/

const routes = require('express').Router();

// const jwt = require('jsonwebtoken');
const db = require('../db.config');
// const config = require('../config');
let middleware = require('../middleware');

let { encryptPassword, isValidPassword, generateToken } = require('../utils');

// GET /api/v1/**
// TODO : Not working in route file, need to find solution
routes.get('/*', middleware.checkToken, (request, response) => {
    response.status(200).json({ message: 'Connected!' });
});


// Login (/api/v1/login) [POST]
routes.post('/login', (request, response) => {
    let username = request.body.username.trim();
    let password = request.body.password.trim();

    // For the given username fetch user from DB
    // let mockedUsername = 'admin';
    // let mockedPassword = 'password';

    if (username && password) {

        // Find all documents in the collection
        db.users.findOne({ username: username }).sort({ date: -1 }).exec(function (error, doc) {

            if (error) {
                return error;
            }

            if (doc) {
                let passwordHash = isValidPassword(password, doc.salt);

                if (doc.username === username && doc.password === passwordHash) {
                    let token = generateToken({
                        username: doc.username,
                        name: doc.name,
                        _id: doc._id,
                        admin: doc.admin
                    });

                    // return the JWT token for the future API calls
                    response.status(200).json({
                        success: true,
                        message: 'Authentication successful!',
                        token: token,
                        name: doc.username,
                        admin: doc.admin,
                        _id: doc._id,
                    });
                } else {
                    // User is registered but don't have valid Username or Password
                    response.status(200).json({
                        success: false,
                        message: 'Incorrect username or password'
                    });
                }
            } else {

                // User is not registered
                response.status(200).send({
                    success: false,
                    message: 'Please check your username and password'
                });
            }

            // response.status(200).send({ message: 'Fetched all the articles successfully', doc });
        });

    } else {
        response.status(400).json({
            success: false,
            message: 'Authentication failed! Please check the request'
        });
    }
});

// Logout (/api/v1/logout) [POST]
routes.post('/logout', (request, response) => {
    res.status(200).send({
        success: true,
        message: 'Logout successfully',
        token: null
    });
});

// Register new user (/api/v1/register) [POST]
routes.post('/register', (request, response) => {
    var body = request.body;

    // Creating a unique salt for a particular user
    let { salt, hash } = encryptPassword(body.password.trim());

    var user = {
        name: body.name.trim(),
        username: body.username.trim(),
        email: body.email.trim(),
        password: hash,
        admin: body.admin,
        isEmailVerified: body.isEmailVerified,
        salt: salt // Salt must be stored into database to decrypt password again using this salt
    };

    db.users.insert(user, function (err, newDoc) {
        // Callback is optional
        // newDoc is the newly inserted document, including its _id
        // newDoc has no key called notToBeSaved since its value was undefined
        if (err) {
            console.log('Error in creating new user : ', err);
            return err
        }
        var token = generateToken(newDoc);

        response.status(200).send({
            message: 'New user created successfully.',
            user: newDoc,
            token: token
        });

    });
});

routes.get('/token/verify', middleware.checkToken, function (req, res, next) {
    var username = req.body.username
    var refreshToken = req.body.refreshToken
    if ((refreshToken in refreshTokens) && (refreshTokens[refreshToken] == username)) {
        var user = {
            'username': username,
            'role': 'admin'
        }
        var token = jwt.sign(user, SECRET, { expiresIn: 300 })
        res.json({ token: 'JWT ' + token })
    }
    else {
        res.send(401)
    }
})

module.exports = routes;
