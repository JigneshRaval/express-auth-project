// server/router/index.js

const routes = require('express').Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../db.config');
const config = require('../config');
let middleware = require('../middleware');

// Utility Functions
// ===========================
function encryptPassword(password) {
    // Hashing user's salt and password with 1000 iterations, 64 length and sha512 digest
    // Syntax : crypto.pbkdf2Sync("password", "salt", "iterations", "length", "digest")
    let salt = crypto.randomBytes(16).toString('hex') || generateSalt(SaltLength);
    let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

    return { salt, hash };
}

function isValidPassword(password, salt) {
    // https://www.geeksforgeeks.org/node-js-password-hashing-crypto-module/
    // Method to check the entered password is correct or not
    // valid password method checks whether the user
    // password is correct or not
    // It takes the user password from the request
    // and salt from user database entry
    // It then hashes user password and salt
    // then checks if this generated hash is equal
    // to user's hash in the database or not
    // If the user's hash is equal to generated hash
    // then the password is correct otherwise not
    // let salt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    return hash;
}

function generateSalt(len) {
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
        setLen = set.length,
        salt = '';
    for (var i = 0; i < len; i++) {
        var p = Math.floor(Math.random() * setLen);
        salt += set[p];
    }
    return salt;
}

// Generate Token using secret from process.env.JWT_SECRET
// process.env.JWT_SECRET = 'keyboard cat 4 ever'
function generateToken(user) {
    //1. Don't use password and other sensitive fields
    //2. Use fields that are useful in other parts of the
    // app/collections/models
    var u = {
        name: user.name,
        username: user.username,
        admin: user.admin,
        _id: user._id.toString(),
    };

    return token = jwt.sign(u, config.secret, {
        // expiresIn: 60 * 60 * 24 // expires in 24 hours
        expiresIn: 5000 // expires in 2000 milliseconds
    });
}

// GET /api
routes.get('/', middleware.checkToken, (request, response) => {
    response.status(200).json({ message: 'Connected!' });
});


// GET : All Articles (/api/articles)
routes.post('/login', (request, response) => {
    let username = request.body.username.trim();
    let password = request.body.password.trim();

    // For the given username fetch user from DB
    // let mockedUsername = 'admin';
    // let mockedPassword = 'password';

    if (username && password) {

        // Find all documents in the collection
        db.users.find({ username: username }).sort({ date: -1 }).exec(function (err, docs) {

            if (err) {
                return err;
            }

            if (docs && docs.length > 0) {
                for (let i = 0; i < docs.length; i++) {
                    let passwordHash = isValidPassword(password, docs[i].salt);
                    console.log('Password ========', docs[i].password, '===', passwordHash)

                    if (docs[i].username === username && docs[i].password === passwordHash) {
                        /* let token = jwt.sign({ username: username },
                            config.secret,
                            {
                                expiresIn: '5000' // expires in 24 hours
                            }
                        ); */
                        let token = generateToken({
                            username: docs[i].username,
                            name: docs[i].name,
                            _id: docs[i]._id,
                            admin: docs[i].admin
                        });
                        // return the JWT token for the future API calls
                        response.status(200).json({
                            success: true,
                            message: 'Authentication successful!',
                            token: token,
                            name: docs[i].username
                        });
                        break;
                    } else {
                        response.status(200).json({
                            success: false,
                            message: 'Incorrect username or password'
                        });
                    }
                }

            } else {
                response.status(200).send({
                    success: false,
                    message: 'Please check your username and password'
                });

            }

            // response.status(200).send({ message: 'Fetched all the articles successfully', docs });
        });

    } else {
        response.status(400).json({
            success: false,
            message: 'Authentication failed! Please check the request'
        });
    }
});

// GET : All tags (/api/articles/tags)
routes.post('/logout', (request, response) => {
    // res.redirect('/login');
    res.status(200).send({
        success: true,
        message: 'Logout successfully'
    });
});


// GET : Get Single Article by Id (/api/articles/:articleId)
routes.post('/register', (request, response) => {
    var body = request.body;

    // Creating a unique salt for a particular user
    let { salt, hash } = encryptPassword(body.password.trim());

    var user = {
        name: body.name.trim(),
        username: body.username.trim(),
        email: body.email.trim(),
        // password: hash,
        password: hash,
        admin: body.admin,
        isEmailVerified: body.isEmailVerified,
        salt: salt
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

module.exports = routes;
