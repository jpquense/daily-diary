require('dotenv').config();

module.exports = {
    ENV: process.env.NODE_ENV || 'production',
    PORT: process.env.PORT,
    CONCURRENCY: process.env.WEB_CONCURRENCY,
    DATABASE_URL: process.env.DATABASE_URL,
    SECRET: process.env.JWT_SECRET,
    EXPIRATION: 864000,
};