'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();
const expect = chai.expect;
const mongoose = require('mongoose');
const faker = require('faker');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const { Gratitude } = require('../gratitudes/models')
const { User } = require('../users/models')
const { app , runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config.js');
const { sendAllDataToDb, createTestUser, createTestUserAndGratitude, generateUserData, generateGratitudeData, tearDownDb } = require('./test-functions-gratitudes')

chai.use(chaiHttp);

let testUser;

describe('/api/gratitudes API Resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(done) {
    createTestUser()
      .then(user => {
        testUser = user;
        return sendAllDataToDb()
      })
      .then(() => done())
      .catch(err => console.log(err))
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('GET request to /gratitudes', function() {
    it('should list all existing gratitudes', function() {
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      let res;
      return chai.request(app)
      .get('/api/gratitudes')
      .set('Authorization', `Bearer ${token}`)
      .then(function(_res) {
        res = _res;
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.an('object');
      })
    });
  });

  describe('Post request to /gratitudes', function() {
    it('should add a gratitude', function() {
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      const newGratitude = generateGratitudeData();
      return chai.request(app)
        .gratitude('/api/gratitudes')
        .set('Authorization', `Bearer ${token}`)
        .send(newGratitude)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body.gratitude).to.deep.equal(newGratitude.gratitude);
      });
    });
  });

  describe('PUT request to /gratitudes', function() {
    it('should update gratitude', function() {
      const updateGratitude = {
        gratitude: faker.lorem.sentence()
      };
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      return Gratitude
        .findOne()
        .then(result => {
          updateGratitude._id = result._id;
          return chai.request(app)
          .put(`/api/gratitudes/${result._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateGratitude)
        })
        .then(res => {
          res.should.have.status(204);
          res.should.be.an("object");
          return Gratitude.findById(updateGratitude._id);
        })
        .then(gratitude => {
          gratitude.gratitude.should.deep.equal(updateGratitude.gratitude);
        });
      });
    });

  describe('DELETE endpoint', function() {
    it('should delete a gratitude by id', function() {
      let deletedGratitude;
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      return Gratitude
        .findOne()
        .then(_gratitude => {
          deletedGratitude = _gratitude._id;
          return chai.request(app)
            .delete(`/api/gratitudes/${deletedGratitude}`)
            .set('Authorization', `Bearer ${token}`)
        })
        .then(res => {
          res.should.have.status(204);
          return Gratitude.findById(deletedGratitude);
        })
        .then(gratitude => {
          should.not.exist(gratitude);
        });
      });
    });
});