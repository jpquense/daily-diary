'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/daily-diary';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-daily-diary';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'jetyjei8ssxkfgjsfdjgsdf324sdffgnmklq';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';