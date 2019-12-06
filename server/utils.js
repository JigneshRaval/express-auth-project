
// Utility Functions
// ===========================
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const APP_CONSTANTS = require('./config.js');

class UtilityService {
    // TODO: Move all the functions here
}

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
    //2. Use fields that are useful in other parts of the  /app/collections/models

    // iat : is a Time when the token was issued (Time is in seconds, NO milliseconds)
    // exp : is a time when token will expire (Time is in seconds, NO milliseconds),
    // We can also use : 60, "2 days", "10h", "7d"
    var u = {
        username: user.username,
        _id: user._id.toString(),
        iat: Math.floor((new Date().getTime() + 0 * 1000) / 1000),
        exp: Math.floor((new Date().getTime() + APP_CONSTANTS.JWT_EXPIRE_TIME) / 1000), // Expire JWT after 1 minute
        alg: 'HS256',
    };

    return token = jwt.sign(u, APP_CONSTANTS.JWT_SECRET, {
        // expiresIn: 60 * 60 * 24 // expires in 24 hours
        // expiresIn: 5000 // expires in 2000 milliseconds
    });
}

function createAccessToken() {
    return jwt.sign({
        // iss: config.issuer,
        // aud: config.audience,
        exp: Math.floor(Date.now() + APP_CONSTANTS.JWT_EXPIRE_TIME) / 1000,
        scope: 'full_access',
        sub: "lalaland|gonto",
        jti: genJti(), // unique identifier for the token
        alg: 'HS256'
    }, APP_CONSTANTS.JWT_SECRET);
}

// Generate Unique Identifier for the access token
function genJti() {
    let jti = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
        jti += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return jti;
}
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
let smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    host: APP_CONSTANTS.GMAIL_SERVICE_HOST,
    port: APP_CONSTANTS.GMAIL_SERVICE_PORT,
    secure: true,
    auth: {
        // should be replaced with real sender's account
        // user: config.GMAIL_USER_NAME,
        // pass: config.GMAIL_USER_PASSWORD
    }
});
var rand, mailOptions, host, link;

// REF : http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose
function isLocked(lockUntil) {
    // lockUntil time will be future time, it means when user do wrong attempts lock their account for few hours or a day (24 hours)
    // So that time will be greater then the current time.
    // Once that locking period will be over, then the current time will be greater then the lock time

    if (lockUntil) {
        if (lockUntil > Date.now()) {
            console.log('lockUntil is greater');
            return true;
        } else {
            console.log('lockUntil is lower');
            return false;
        }
    }

    // Shorthand method of above given if condition
    // return !!(lockUntil && lockUntil > Date.now());
}

function incrementLoginAttempts(doc) {
    // if we have a previous lock that has expired, restart at 1
    if (doc.lockUntil && doc.lockUntil < Date.now()) {
        return {
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }
    }

    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };

    // lock the account if we've reached max attempts and it's not locked already
    if (doc.loginAttempts + 1 >= APP_CONSTANTS.MAX_LOGIN_ATTEMPTS && !isLocked(doc.isLocked)) {
        // lockUntil time will be future time, it means when user do wrong attempts lock their account for few hours or a day (24 hours)
        // So that time will be greater then the current time.
        // Once that locking period will be over, then the current time will be greater then the lock time
        updates.$set = { lockUntil: Date.now() + APP_CONSTANTS.ACCOUNT_LOCK_TIME };
    }

    return updates;
}

function getUserIP(request) {
    var ip = (request.headers['x-forwarded-for'] || '').split(',').pop() ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        (request.connection.socket ? request.connection.socket.remoteAddress : null);

    // console.log('getUserIP() :', request.headers['x-forwarded-for'], request.connection, request.socket);
    return ip;
}

module.exports = {
    encryptPassword,
    isValidPassword,
    generateToken,
    isLocked,
    incrementLoginAttempts,
    getUserIP
}
