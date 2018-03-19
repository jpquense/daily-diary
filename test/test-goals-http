'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const { Goals } = require('../models/goals.model');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config/main.config');

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

// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedgoalsData() {
  console.info('seeding blog goal data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      content: faker.lorem.sentence(),
      date: Date.random() || Date.now()
    });
  }
  return goals.insertMany(seedData);
}

describe('goals API resource', function () {
  before(function () {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function () {
    return seedgoalsData();
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
        .get('/goals')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.length.of.at.least(1);
          return goals.count();
        })
        .then(count => {
          res.body.should.have.length.of(count);
        });
    });

    it('should return goals with right fields', function () {
      // Strategy: Get back all goals, and ensure they have expected keys
      let resgoal;
      return chai.request(app)
        .get('/goals')
        .then(function (res) {

          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);

          res.body.forEach(function (goal) {
            goal.should.be.a('object');
            goal.should.include.keys('id', 'date', 'content', 'created');
          });

          resgoal = res.body[0];
          return goals.findById(resgoal.id);
        })
        .then(goal => {
          resgoal.title.should.equal(goal.date);
          resgoal.content.should.equal(goal.content);
        });
    });
  });

  describe('goal endpoint', function () {
    it('should add a new goal', function () {

      const newgoal = {
        date: faker.lorem.text(),
        content: faker.lorem.text()
      };

      return chai.request(app)
        .goal('/goals')
        .send(newgoal)
        .then(function (res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'id', 'date', 'content', 'created');
          res.body.date.should.equal(newgoal.date);
          res.body.id.should.not.be.null;
          res.body.content.should.equal(newgoal.content);
          return goals.findById(res.body.id);
        })
        .then(function (goal) {
          goal.date.should.equal(newgoal.date);
          goal.content.should.equal(newgoal.content);
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
        date: Date.now(),
        content: 'dogs dogs dogs'
      };

      return goals
        .findOne()
        .then(goal => {
          updateData.id = goal.id;

          return chai.request(app)
            .put(`/goals/${goal.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return goals.findById(updateData.id);
        })
        .then(goal => {
          goal.date.should.equal(updateData.date);
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

      return goals
        .findOne()
        .then(_goal => {
          goal = _goal;
          return chai.request(app).delete(`/goals/${goal.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return goals.findById(goal.id);
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