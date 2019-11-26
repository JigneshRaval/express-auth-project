const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

let jwt = require('jsonwebtoken');
let config = require('./config');
const db = require('./db.config');
let middleware = require('./middleware');

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

class HandlerGenerator {
    login(req, res) {
        let username = req.body.username.trim();
        let password = req.body.password.trim();

        // For the given username fetch user from DB
        // let mockedUsername = 'admin';
        // let mockedPassword = 'password';

        if (username && password) {

            // Find all documents in the collection
            db.users.find({ username: username, password: password }).sort({ date: -1 }).exec(function (err, docs) {

                if (err) {
                    return err;
                }

                if (docs && docs.length > 0) {
                    for (let i = 0; i < docs.length; i++) {
                        if (docs[i].username === username && docs[i].password === password) {
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
                            res.json({
                                success: true,
                                message: 'Authentication successful!',
                                token: token
                            });
                            break;
                        } else {
                            res.send(403).json({
                                success: false,
                                message: 'Incorrect username or password'
                            });
                        }
                    }

                } else {
                    res.status(200).send({
                        success: false,
                        message: 'Please check your username and password'
                    });

                }

                // response.status(200).send({ message: 'Fetched all the articles successfully', docs });
            });

        } else {
            res.send(400).json({
                success: false,
                message: 'Authentication failed! Please check the request'
            });
        }
    }

    logout(req, res) {
        // res.redirect('/login');
        res.status(200).send({
            success: true,
            message: 'Logout successfully'
        });

    }

    register(req, res) {
        var body = req.body;

        // var hash = bcrypt.hashSync(body.password.trim(), 10);

        var user = {
            name: body.name.trim(),
            username: body.username.trim(),
            email: body.email.trim(),
            // password: hash,
            password: body.password.trim(),
            admin: body.admin,
            isEmailVerified: body.isEmailVerified
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

            res.status(200).send({
                message: 'New user created successfully.',
                user: newDoc,
                token: token
            });

        });
    }

    index(req, res) {
        res.json({
            success: true,
            message: 'Index page'
        });
    }
}

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
const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}

// Starting point of the server
function main() {
    let app = express(); // Export app for other routes to use
    let handlers = new HandlerGenerator();

    const port = process.env.PORT || 3004;

    app.use(bodyParser.urlencoded({ // Middleware
        extended: true
    }));
    app.use(bodyParser.json());
    console.log('__dirname :', __dirname);
    app.use(express.static(path.resolve(__dirname, '../')));

    app.use(allowCrossDomain)

    // Routes & Handlers
    app.post('/login', handlers.login);
    app.post('/logout', handlers.logout);
    app.post('/home', middleware.checkToken, handlers.index);
    app.post('/register', handlers.register);
    // app.get('/', middleware.checkToken, handlers.index);

    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();
