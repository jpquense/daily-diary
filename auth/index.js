'use strict';
const {router} = require('./routers/router');
const {localStrategy, jwtStrategy} = require('./strategies');

module.exports = {router, localStrategy, jwtStrategy};
