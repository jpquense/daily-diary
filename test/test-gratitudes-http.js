'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const { Gratitudes } = require('../models/gratitudes.models');
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
function seedGratitudesData() {
  console.info('seeding gratitude data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      content: faker.lorem.sentence(),
      date: Date.now() || "2018-2-15"
    });
  }
  return Gratitudes.insertMany(seedData);
}

describe('Gratitudes API resource', function () {
  before(function () {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function () {
    return seedGratitudesData();
  });
  afterEach(function () {
    return tearDownDb();
  });
  after(function () {
    return closeServer();
  });

  describe('GET endpoint', function () {
    it('should return all existing gratitudes', function () {
      let res;
      return chai.request(app)
        .get('/api/gratitudes')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.length.of.at.least(1);

          return Gratitudes.count();
        })
        .then(count => {
          res.body.should.have.length.of.at.least(10);
          // res.body.should.have.length.of(count);
        });
    });

    it('should return gratitudes with right fields', function () {
      // Strategy: Get back all gratitudes, and ensure they have expected keys
      let resGratitude;
      return chai.request(app)
        .get('/api/gratitudes')
        .then(function (res) {

          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);

          res.body.forEach(function (gratitude) {
            gratitude.should.be.a('object');
            gratitude.should.include.keys('id', 'date', 'content');
          });

          resGratitude = res.body[0];
          return Gratitudes.findById(resGratitude.id);
        })
        .then(gratitude => {
          // resGratitude.date.should.equal(gratitude.date);
          resGratitude.content.should.equal(gratitude.content);
        });
    });
  });

  describe('gratitude endpoint', function () {
    it('should add a new gratitude', function () {

      const newGratitude = {
        date: "2016-10-20",
        content: faker.lorem.text()
      };

      return chai.request(app)
        .post('/api/gratitudes')
        .send(newGratitude)
        .then(function (res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'id', 'date', 'content');
          // res.body.date.should.equal(newGratitude.date);
          res.body.id.should.not.be.null;
          res.body.content.should.equal(newGratitude.content);
          return Gratitudes.findById(res.body.id);
        })
        .then(function (gratitude) {
          // gratitude.date.should.equal(newGratitude.date);
          gratitude.content.should.equal(newGratitude.content);
        });
    });
  });

  describe('PUT endpoint', function () {
    // strategy:
    //  1. Get an existing gratitude from db
    //  2. Make a PUT request to update that gratitude
    //  4. Prove gratitude in db is correctly updated
    it('should update fields you send over', function () {
      const updateData = {
        date: "2016-10-20",
        content: 'dogs dogs dogs'
      };

      return Gratitudes
        .findOne()
        .then(gratitude => {
          updateData.id = gratitude.id;

          return chai.request(app)
            .put(`/api/gratitudes/${gratitude.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return Gratitudes.findById(updateData.id);
        })
        .then(gratitude => {
          // gratitude.date.should.equal(updateData.date);
          gratitude.content.should.equal(updateData.content);
        });
    });
  });

  describe('DELETE endpoint', function () {
    // strategy:
    //  1. get a gratitude
    //  2. make a DELETE request for that gratitude's id
    //  3. assert that response has right status code
    //  4. prove that gratitude with the id doesn't exist in db anymore
    it('should delete a gratitude by id', function () {

      let gratitude;

      return Gratitudes
        .findOne()
        .then(_gratitude => {
          gratitude = _gratitude;
          return chai.request(app).delete(`/api/gratitudes/${gratitude.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return Gratitudes.findById(gratitude.id);
        })
        .then(_gratitude => {
          // when a variable's value is null, chaining `should`
          // doesn't work. so `_gratitude.should.be.null` would raise
          // an error. `should.be.null(_gratitude)` is how we can
          // make assertions about a null value.
          should.not.exist(_gratitude);
        });
    });
  });
});