const jwt = require('jsonwebtoken');
const APP_CONSTANTS = require('./config.js');

const checkTokenMiddleware = (req, res, next) => {
    // Express headers are auto converted to lowercase
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token && token.startsWith('Bearer ')) {
        // Remove Bearer from string
        // token = token.slice(7, token.length);
        token = token.replace('Bearer ', '');
    }

    if (token) {
        jwt.verify(token, APP_CONSTANTS.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: err.message
                });
            } else {
                req.decoded = decoded;

                // Get token expiry time in minutes
                const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
                res.locals.expTime = (decoded.exp - nowUnixSeconds) / 60;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};

// REF : https://www.sohamkamani.com/blog/javascript/2019-03-29-node-jwt-authentication/
const refreshToken = (req, res) => {
    // (BEGIN) The code until this point is the same as the first part of the `welcome` route
    // const token = req.cookies.token
    // Express headers are auto converted to lowercase
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token && token.startsWith('Bearer ')) {
        // Remove Bearer from string
        // token = token.slice(7, token.length);
        token = token.replace('Bearer ', '');
    }

    if (!token) {
        return res.status(401).end();
    }

    var payload;

    try {
        payload = jwt.verify(token, APP_CONSTANTS.JWT_SECRET)
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end();
        }

        return res.status(400).end();
    }
    // (END) The code until this point is the same as the first part of the `welcome` route

    // We ensure that a new token is not issued until enough time has elapsed
    // In this case, a new token will only be issued if the old token is within
    // 30 seconds of expiry. Otherwise, return a bad request status
    const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
    console.log('Refresh token : ', payload.exp, nowUnixSeconds, payload.exp - nowUnixSeconds)
    if (payload.exp - nowUnixSeconds > (1 * 60)) {
        return res.status(200).json({
            success: false,
            message: 'Token is still valid.'
        });
    }

    // Now, create a new token for the current user, with a renewed expiration time
    const newToken = jwt.sign({
        username: payload.username,
        _id: payload._id.toString(),
        exp: Math.floor((new Date().getTime() + APP_CONSTANTS.JWT_EXPIRE_TIME) / 1000)
    }, APP_CONSTANTS.JWT_SECRET, {
        algorithm: 'HS256'
    });

    // Set the new token as the users `token` cookie
    // res.cookie('token', newToken, { maxAge: jwtExpirySeconds * 1000 })
    res.status(200).json({
        success: true,
        token: newToken,
        message: 'refreshToken() : Token Renewed'
    });
}

module.exports = {
    checkToken: checkTokenMiddleware,
    refreshToken: refreshToken
}
