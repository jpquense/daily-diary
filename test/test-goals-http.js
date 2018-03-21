'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const { Goals } = require('../models/goals.models');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config/config');

chai.use(chaiHttp);

// this function deletes the entire database.
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

// generate placeholder values for date, content
// and then we insert that data into mongo
function seedGoalsData() {
  console.info('seeding goal data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      content: faker.lorem.sentence(),
      date: Date.now() || "2018-2-15"
    });
  }
  return Goals.insertMany(seedData);
}

describe('Goals API resource', function () {
  before(function () {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function () {
    return seedGoalsData();
  });
  afterEach(function () {
    return tearDownDb();
  });
  after(function () {
    return closeServer();
  });

  describe('GET endpoint', function () {
    it('should return all existing goals', function () {
      let res;
      return chai.request(app)
        .get('/api/goals')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.length.of.at.least(1);

          return Goals.count();
        })
        .then(count => {
          res.body.should.have.length.of.at.least(10);
          // res.body.should.have.length.of(count);
        });
    });

    it('should return goals with right fields', function () {
      // Strategy: Get back all Goals, and ensure they have expected keys
      let resGoal;
      return chai.request(app)
        .get('/api/goals')
        .then(function (res) {

          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);

          res.body.forEach(function (goal) {
            goal.should.be.a('object');
            goal.should.include.keys('id', 'date', 'content');
          });

          resGoal = res.body[0];
          return Goals.findById(resGoal.id);
        })
        .then(goal => {
          // resGoal.date.should.equal(goal.date);
          resGoal.content.should.equal(goal.content);
        });
    });
  });

  describe('goal endpoint', function () {
    it('should add a new goal', function () {

      const newGoal = {
        date: "2016-10-20",
        content: faker.lorem.text()
      };

      return chai.request(app)
        .post('/api/goals')
        .send(newGoal)
        .then(function (res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'id', 'date', 'content');
          // res.body.date.should.equal(newGoal.date);
          res.body.id.should.not.be.null;
          res.body.content.should.equal(newGoal.content);
          return Goals.findById(res.body.id);
        })
        .then(function (goal) {
          // goal.date.should.equal(newGoal.date);
          goal.content.should.equal(newGoal.content);
        });
    });
  });

  describe('PUT endpoint', function () {
    // strategy:
    //  1. Get an existing goal from db
    //  2. Make a PUT request to update that goal
    //  4. Prove goal in db is correctly updated
    it('should update fields you send over', function () {
      const updateData = {
        date: "2016-10-20",
        content: 'dogs dogs dogs'
      };

      return Goals
        .findOne()
        .then(goal => {
          updateData.id = goal.id;

          return chai.request(app)
            .put(`/api/goals/${goal.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return Goals.findById(updateData.id);
        })
        .then(goal => {
          // goal.date.should.equal(updateData.date);
          goal.content.should.equal(updateData.content);
        });
    });
  });

  describe('DELETE endpoint', function () {
    // strategy:
    //  1. get a goal
    //  2. make a DELETE request for that goal's id
    //  3. assert that response has right status code
    //  4. prove that goal with the id doesn't exist in db anymore
    it('should delete a goal by id', function () {

      let goal;

      return Goals
        .findOne()
        .then(_goal => {
          goal = _goal;
          return chai.request(app).delete(`/api/goals/${goal.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return Goals.findById(goal.id);
        })
        .then(_goal => {
          // when a variable's value is null, chaining `should`
          // doesn't work. so `_goal.should.be.null` would raise
          // an error. `should.be.null(_goal)` is how we can
          // make assertions about a null value.
          should.not.exist(_goal);
        });
    });
  });
});