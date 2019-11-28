# Tutorials

## Node.js + Crypto

## Example 1 : Lets Code a Hashing system using crypto library

https://hptechblogs.com/password-hashing-in-node-js-using-the-pbkdf2-in-crypto-library/

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
