'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const should = require('chai').should();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const { Gratitude } = require('../gratitudes/models');
const { User } = require('../users/models')
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');
const expect = chai.expect;
chai.use(chaiHttp);

function sendAllDataToDb() {
  console.info('Sending data to database...');
  const testData = [];
  for (let i=0; i<=1; i++) {
    testData.push(createTestUserAndGratitude());
  }
  return Gratitude.insertMany(testData);
}

function generateGratitudeData() {
  console.log(`Generating Gratitude data...`);
  return {
    gratitude: faker.lorem.sentence()
  }
}

function createTestUser() {
  return User.create(generateUserData());
}

function generateUserData() {
  console.log(`Generating user data...`);
  return {
    firstName: faker.name.firstName(),
    lastName: faker.random.word(),
    username: faker.random.word(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }
}

function createTestUserAndGratitude(i) {
  return User.create(generateUserData())
    .then(user => {
      let userId = user._id;
      let username = user.username;
      let email = user.email;
      const data = [];
      for(let x = 0; x < 5; x++) {
        let newGratitude = generateGratitudeData();
        newGratitude.author = userId;
        data.push(Gratitude.create(newGratitude));
      }
      console.log(`Generated goals`);
      return Promise.all(data);
    })
}

function tearDownDb() {
  return new Promise ((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}


let testUser;

describe('/api/goals API Resource', function() {
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

  describe('GET request to /api/gratitudes', function() {
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
        res.body.should.have.length.of.at.least(1);
        res.body.forEach(function (gratitude) {
          gratitude.should.be.a('object');
          gratitude.should.include.keys('_id', 'gratitude');
        });
        return Gratitude.count();
      })
      .then(count => {
        res.body.should.have.length.of.at.least(5);
      });
    });
  });


  describe('POST request to /api/gratitudes', function() {
    it('should add a gratitude', function() {
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      const newGratitude = generateGoalData();
      return chai.request(app)
        .post('/api/gratitudes')
        .set('Authorization', `Bearer ${token}`)
        .send(newGratitude)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body.gratitude).to.deep.equal(newGratitude.gratitude);
      });
    });
  });

  describe('PUT request to /api/gratitudes', function() {
    it('should update gratitude sent', function() {
      const updateData = {
        gratitude: faker.lorem.sentence()
      };
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      return Gratitude
        .findOne()
        .then(result => {
          updateData._id = result._id;
          return chai.request(app)
          .put(`/api/gratitudes/${result._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData)
        })
        .then(res => {
          res.should.have.status(204);
          return Gratitude.findById(updateData._id);
        })
        .then(gratitude => {
          gratitude.gratitude.should.deep.equal(updateData.gratitude);
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
            .delete(`api/gratitudes/${deletedGratitude}`)
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