'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { app, closeServer, runServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config/config');


const expect = chai.expect;

chai.use(chaiHttp);

describe('login.html page', function() {
    before(function(){
        return runServer(TEST_DATABASE_URL);
    });
    after(function() {
        return closeServer();
    });
    it('should return login.html and 200 status', function() {
        return chai.request(app)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });
});

describe('signup.html page', function() {
    before(function(){
        return runServer();
    });
    after(function() {
        return closeServer();
    });
    it('should return signup.html and 200 status', function() {
        return chai.request(app)
            .get('/signup/signup.html')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });
});

describe('home.html page', function() {
    before(function(){
        return runServer();
    });
    after(function() {
        return closeServer();
    });
    it('should return home.html and 200 status', function() {
        return chai.request(app)
            .get('/home/home.html')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });
});

describe('gratitudes.html page', function() {
    before(function(){
        return runServer();
    });
    after(function() {
        return closeServer();
    });
    it('should return gratitudes.html and 200 status', function() {
        return chai.request(app)
            .get('/gratitudes/gratitudes.html')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });
});

describe('goals.html page', function() {
    before(function(){
        return runServer();
    });
    after(function() {
        return closeServer();
    });
    it('should return goals.html and 200 status', function() {
        return chai.request(app)
            .get('/goals/goals.html')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });
});