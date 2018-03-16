'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/daily-diary';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-daily-diary';
exports.PORT = process.env.PORT || 8080;