'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const expect = chai.expect;

const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');
const {app, runServer, closeServer} = require('../server');
const { Goal } = require('../goals/models');
const {User} = require('../users');


chai.use(chaiHttp);

function sendAllDataToDb() {
  console.info('Sending data to database...');
  const testData = [];
  for (let i=0; i<=1; i++) {
    testData.push(createTestUserAndGoal());
  }
  return Goal.insertMany(testData);
}

function generateGoalData() {
  console.log(`Generating user data...`);
  return {
    goal: faker.lorem.sentence()
  }
}

function createTestUser() {
  return User.create(generateUserData());
}

function generateUserData() {
  console.log(`Generating user data...`);
  return {
    firstName: faker.random.word(),
    lastName: faker.random.word(),
    username: faker.random.word(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }
}

function createTestUserAndGoal(i) {
  return User.create(generateUserData())
    .then(user => {
      let userId = user._id;
      let username = user.username;
      let email = user.email;
      const data = [];
      for(let x = 0; x < 5; x++) {
        let newGoal = generateGoalData();
        newGoal.author = userId;
        data.push(Goal.create(newGoal));
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

let testUserData;
let testUser;

describe('/api/users API Resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(done) {
    testUserData = generateUserData();
    User.create(testUserData)
      .then(user => {
        testUser = user;
        console.log(testUserData.username);
        console.log(testUserData.password);
        sendAllDataToDb()
        .then(() => done());
      })
      .catch(err => console.log(err))
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('/api/users', function() {
    describe('POST', function() {
      it('Should reject users with missing username', function() {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            email,
            username,
            password,
            firstName,
            lastName
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
      });
      it('Should reject users with missing password', function() {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            email,
            username,
            password,
            firstName,
            lastName
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with non-string username', function() {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username: 1234,
            password,
            firstName,
            lastName,
            email,
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('username');
          });
      });
      it('Should reject users with non-string password', function() {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username,
            password: 1234,
            firstName,
            lastName,
            email
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with non-string first name', function() {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username,
            password,
            firstName: 1234,
            lastName,
            email
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('firstName');
          });
      });
      it('Should reject users with non-string last name', function() {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username,
            email,
            password,
            firstName,
            lastName: 1234
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('lastName');
          });
      });
      it('Should reject users with empty username', function() {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username: '',
            password,
            firstName,
            lastName,
            email
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 1 characters long'
            );
            expect(res.body.location).to.equal('username');
          });
      });

      it('Should create a new user', function() {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username,
            password,
            firstName,
            lastName,
            email
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'username',
              'firstName',
              'lastName',
              'email'
            );
            expect(res.body.username).to.equal(username);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstName).to.equal(firstName);
            expect(user.lastName).to.equal(lastName);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });

    });

  });
});
