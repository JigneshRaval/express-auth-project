// server/router/auth-routes.js

// Implemented Node.js Crypto module to hash/salt password
// Ref : https://www.geeksforgeeks.org/node-js-password-hashing-crypto-module/

const routes = require('express').Router();
const db = require('../db.config');
const middleware = require('../middleware');
const APP_CONSTANTS = require('../config');
let { encryptPassword, isValidPassword, generateToken, getUserIP, incrementLoginAttempts, isLocked } = require('../utils');

// Login (/api/v1/login) [POST]
routes.post('/login', (request, response) => {
    let username = request.body.username.trim();
    let password = request.body.password.trim();

    // For the given username fetch user from DB
    // let mockedUsername = 'admin';
    // let mockedPassword = 'password';
    var updates = {};

    if (username && password) {

        // Find all documents in the collection
        db.users.findOne({ username: username }).sort({ date: -1 }).exec(function (error, user) {

            if (error) {
                return error;
            }

            // make sure the user exists
            if (!user) {
                return response.status(200).json({
                    success: false,
                    errorCode: APP_CONSTANTS.ERROR_NOT_FOUND,
                    message: 'Your account does not exists with us.'
                });
            }

            // incrementLoginAttempts(doc.lockUntil, db.user);
            console.log('isLocked :: ', isLocked(user.lockUntil), '===', new Date(user.lockUntil).toString(), '======', new Date(Date.now()).toString());

            // check if the account is currently locked
            if (isLocked(user.lockUntil)) {
                updates = incrementLoginAttempts(user);

                // Set an existing field's value
                return db.users.update({ username: username }, updates, function (err, numReplaced) {
                    response.status(200).json({
                        success: false,
                        errorCode: APP_CONSTANTS.ERROR_MAX_ATTEMPTS,
                        message: 'Your account has been locked due to too many login attempts. Please try again after ' + (APP_CONSTANTS.ACCOUNT_LOCK_TIME / 1000 / 60) + 'minutes',
                        failedAttempt: user.loginAttempts,
                        lockUntil: user.lockUntil
                    });
                });
            }

            if (user) {
                let passwordHash = isValidPassword(password, user.salt);

                // check if the password was a match
                // if there's no lock or failed attempts, just return the user
                if (user.username === username && user.password === passwordHash) {

                    let token = generateToken({
                        username: user.username,
                        name: user.name,
                        _id: user._id,
                        admin: user.admin
                    });

                    // reset attempts and lock info
                    var updates = {
                        $set: { loginAttempts: 0 },
                        $unset: { lockUntil: 1 }
                    };

                    db.users.update({ username: username }, updates, function (err) {
                        if (err) {
                            return err;
                        }
                    });

                    // return the JWT token for the future API calls
                    response.status(200).json({
                        success: true,
                        message: 'Authentication successful!',
                        token: token,
                        name: user.username,
                        admin: user.admin,
                        _id: user._id,
                    });

                } else {

                    updates = incrementLoginAttempts(user)

                    // Set an existing field's value
                    db.users.update({ username: username }, updates, function (err, numReplaced) {
                        response.status(200).json({
                            success: false,
                            errorCode: APP_CONSTANTS.ERROR_PASSWORD_INCORRECT,
                            message: 'Incorrect username or password ' + user.loginAttempts,
                            failedAttempt: user.loginAttempts,
                            lockUntil: user.lockUntil
                        });
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
        salt: salt, // Salt must be stored into database to decrypt password again using this salt,
        resetPasswordToken: 'randomString',
        resetPasswordExpires: new Date(),
        loginAttempts: 0,
        lockUntil: 0,
        isLocked: false,
        userIPAddress: request.connection.remoteAddress
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

// https://solidgeargroup.com/refresh-token-with-jwt-authentication-node-js/
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
});

// https://solidgeargroup.com/refresh-token-with-jwt-authentication-node-js/
routes.get('/refreshToken', middleware.refreshToken);

// GET /api/v1/**
// TODO : Not working in route file, need to find solution
routes.get('/*', middleware.checkToken, (request, response) => {
    console.log('IP : ', getUserIP(request), response.locals.expTime);
    response.status(200).json({ message: 'Connected!', ip: getUserIP(request), tokenExpiryTime: response.locals.expTime });
});

/*
routes.post('/send', function (req, res) {
    rand = Math.floor((Math.random() * 100) + 54);
    host = req.get('host');
    link = "http://" + req.get('host') + "/verify?id=" + rand;

    mailOptions = {
        from: 'jr2019.demo@gmail.com', // sender address
        to: 'jr2019.demo@gmail.com',
        subject: "Please confirm your Email account",
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
    }
    // verify connection configuration
    smtpTransport.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log('Server is ready to take our messages');
        }
    });

    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
}); */

module.exports = routes;
