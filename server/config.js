module.exports = {
    JWT_SECRET: 'worldisfullofdevelopers',
    JWT_EXPIRE_TIME: 2 * 60 * 1000, // 2 minute = 120000ms
    GMAIL_SERVICE_NAME: 'gmail',
    GMAIL_SERVICE_HOST: 'smtp.gmail.com',
    GMAIL_SERVICE_SECURE: true, // use SSL
    GMAIL_SERVICE_PORT: 465, // 587
    GMAIL_ADDRESS: 'username@gmail.com',
    GMAIL_PASSWORD: 'userPassword',
    MAX_LOGIN_ATTEMPTS: 2,
    ACCOUNT_LOCK_TIME: 3 * 60 * 1000, // 3 minutes = 180000ms
    ERROR_NOT_FOUND: 0,
    ERROR_PASSWORD_INCORRECT: 1,
    ERROR_MAX_ATTEMPTS: 2,
};
// 1 second = 1000ms
// 1 minute = 60seconds = 1second * 60 = 1000ms * 60
