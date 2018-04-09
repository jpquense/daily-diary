const faker = require('faker');
const mongoose = require('mongoose');

const { Gratitude } = require('../gratitudes/models')
const { User } = require('../users/models')

function sendAllDataToDb(user) {
  console.info('Sending data to database...');
  const testData = [];
  for (let i=1; i<=2; i++) {
    testData.push(generateGratitudeData(user._id));
  }
  return Gratitude.insertMany(testData);
}

function generateGratitudeData(userId) {
  console.log(`Generating gratitude data...`);
  return {
    gratitude: faker.lorem.sentence(),
    author: userId
  }
}

function generateUserData() {
  console.log(`Generating user data...`);
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.firstName(),
    username: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }
}

function createTestUser() {
  return User.create(generateUserData());
}

function createTestUserAndGratitude(i) {
  return User.create(generateUserData())
    .then(user => {
      let userId = user._id;
      let email = user.email;
      const data = [];
      for(let x = 0; x <= 1; x++) {
        let newGratitude = generateGratitudeData();
        newGratitude.author = userId;
        data.push(Gratitude.create(newGratitude));
      }
      console.log(`Generated gratitudes`);
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

module.exports = { sendAllDataToDb, generateGratitudeData, generateUserData, createTestUser, tearDownDb }