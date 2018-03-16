'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { app, closeServer, runServer } = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('login.html page', function() {
    before(function(){
        return runServer();
    });
    after(function() {
        return closeServer();
    });
    it('should return signup.html and 200 status', function() {
        return chai.request(app)
            .get('/')
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });
});