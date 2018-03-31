'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const should = require('chai').should();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const { Goal } = require('../goals/models');
const { User } = require('../users/models')
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');
const expect = chai.expect;
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
  console.log(`Generating goal data...`);
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
    firstName: faker.name.firstName(),
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
      for(let x = 0; x < 3; x++) {
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

  describe('GET request to /api/goals', function() {
    it('should list all existing goals', function() {
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      let res;
      return chai.request(app)
      .get('/api/goals')
      .set('Authorization', `Bearer ${token}`)
      .then(function(_res) {
        res = _res;
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.an('object');
        res.body.should.have.length.of.at.least(1);
        res.body.forEach(function (goal) {
          goal.should.be.a('object');
          goal.should.include.keys('_id', 'goal');
        });
        return Goal.count();
      })
      .then(count => {
        res.body.should.have.length.of.at.least(3);
      });
    });
  });


  describe('POST request to /api/goals', function() {
    it('should add a goal', function() {
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      const newGoal = generateGoalData();
      return chai.request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${token}`)
        .send(newGoal)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body.goal).to.deep.equal(newGoal.goal);
      });
    });
  });

  describe('PUT request to /api/goals', function() {
    it('should update fields sent', function() {
      const updateData = {
        goal: faker.lorem.sentence()
      };
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      return Goal
        .findOne()
        .then(result => {
          updateData._id = result._id;
          return chai.request(app)
          .put(`/api/goals/${result._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData)
        })
        .then(res => {
          res.should.have.status(204);
          return Goal.findById(updateData._id);
        })
        .then(goal => {
          goal.goal.should.deep.equal(updateData.goal);
        });
      });
    });

  describe('DELETE endpoint', function() {
    it('should delete a goal by id', function() {
      let deletedGoal;
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      return Goal
        .findOne()
        .then(_goal => {
          deletedGoal = _goal._id;
          return chai.request(app)
            .delete(`api/goals/${deletedGoal}`)
            .set('Authorization', `Bearer ${token}`)
        })
        .then(res => {
          res.should.have.status(204);
          return Goal.findById(deletedGoal);
        })
        .then(goal => {
          should.not.exist(goal);
        });
      });
    });
});