# Tutorials

## Node.js + Crypto

## Example 1 : Lets Code a Hashing system using crypto library

https://hptechblogs.com/password-hashing-in-node-js-using-the-pbkdf2-in-crypto-library/

**Note : Salt need to be stored into database along with hashed password**

```javascript
const crypto = require('crypto');

// Create password hash using Password based key derivative function 2
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
    return [salt, hash].join('$');
}

// Checking the password hash
function verifyHash(password, original) {
    const originalHash = original.split('$')[1];
    const salt = original.split('$')[0];
    const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');

    return hash === originalHash
}

let hash = hashPassword('test');
console.log('HASH = '+hash);
console.log(verifyHash('test',hash)); // will return true
console.log(verifyHash('test1',hash)); // will return false
```

## Example 2 : Password hashing for node.js using Crypto

```javascript
var crypto = require('crypto');

var SaltLength = 9;

function createHash(password) {
    var salt = generateSalt(SaltLength);
    var hash = md5(password + salt);
    return salt + hash;
}

function validateHash(hash, password) {
    var salt = hash.substr(0, SaltLength);
    var validHash = salt + md5(password + salt);
    return hash === validHash;
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

function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

module.exports = {
    'hash': createHash,
    'validate': validateHash
};
```

## How to set expiration time in JWT

[Unable to set Exp and Iat for JWT correctly(https://stackoverflow.com/questions/33322407/unable-to-set-exp-and-iat-for-jwt-correctly)

`new Date().getTime()` give you time in miliseconds.

**NOTE : But time in jwt token (iat, exp) is in seconds, therefore we have to divide result by 1000.**

`var actualTimeInSeconds = new Date().getTime()/1000;`

How to get some time in seconds from now:

`(new Date().getTime() + someTimeInSeconds * 1000)/1000`

If you need 1 hour from now:

`(new Date().getTime() + 60 * 60 * 1000)/1000` (because 1h = 60min * 60 s)

And at this moment you have time in seconds from jwt token and calculated time in seconds. You should only compare this values.

Precisely in your situation you should compare jwt token time with your actual time in seconds. If jwt token expiration time is greater then actual time it means that it is still valid. From docs of jwt token:

The processing of the exp claim requires that the current date/time MUST be before the expiration date/time listed in the exp claim.

**Edit: To get coorect date from `iat`, multiply value by 1000 and add to new Date constructor:** `new Date(iat*1000)`

```javascript
// EXAMPLE : Setting expiration time in JWT

// Generate Token using secret from process.env.JWT_SECRET
// process.env.JWT_SECRET = 'keyboard cat 4 ever'
function generateToken(user) {
    //1. Don't use password and other sensitive fields
    //2. Use fields that are useful in other parts of the  /app/collections/models

    // iat : is a Time when the token was issued (Time is in seconds, NO milliseconds)
    // exp : is a time when token will expire (Time is in seconds, NO milliseconds),
    // We can also use : 60, "2 days", "10h", "7d"
    var u = {
        name: user.name,
        username: user.username,
        admin: user.admin,
        _id: user._id.toString(),
        iat: Math.floor((new Date().getTime() + 0 * 1000) / 1000),
        exp: Math.floor((new Date().getTime() + 0 * 1000) / 1000) + 15, // Expire JWT after 15 seconds
    };

    return token = jwt.sign(u, config.secret, {
        // expiresIn: 60 * 60 * 24 // expires in 24 hours
        // expiresIn: 5000 // expires in 2000 milliseconds
    });
}
```
## collapsible markdown?

<details>
<summary>CLICK ME</summary>
<p>
Content
</p>
</details>
