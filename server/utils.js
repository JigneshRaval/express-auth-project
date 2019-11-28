
// Utility Functions
// ===========================
const crypto = require('crypto');

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

module.exports = {
    encryptPassword,
    isValidPassword,
    generateToken
}
