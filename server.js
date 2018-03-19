'use strict';
// const throng = require('throng');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const winston = require('winston');
const mongoose = require('mongoose');
// const { router: userRouter } = require('./routers/user.router');
const gratitudesRouter = require('./routers/gratitudes.router');
// const goalsRouter = require('./routers/goals.router');

const app = express();

mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config/config');
// const { PORT, DATABASE_URL, CONCURRENCY: WORKERS, ENV } = require('./config/main.config');

app.use(morgan('common'));
// Middlewares
// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Logging
app.use(morgan('common'));

// morgan.token('processId', () => process.pid);
// if (ENV === 'development') {
//   app.use(morgan(':processId - :method :url :status :response-time ms - :res[content-length]'));
// }

// Static Files
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login/login.html');
});

// Routes
// app.use('/api', usersRouter);
app.use('/api', gratitudesRouter);
// app.use('/api', goalsRouter);

app.get('/status', (req, res) => {
  res.json({ processId: process.pid });
});

// Starting Scripts
// let server;
// function runServer(databaseUrl) {
//     return new Promise((res, rej) => {
//         mongoose.connect(databaseUrl, (err) => {
//             if (err) {
//                 return rej(err);
//             }
//             if (ENV === 'development') {
//                 winston.info(`Connected to ${databaseUrl}`);
//             } else {
//                 winston.info('Connected to database');
//             }
//             server = app.listen(PORT, () => {
//                 winston.info(`App is listening on port ${PORT}`);
//                 winston.info(`App is running in ${ENV} environment`);
//                 winston.info(`Worker process id: ${process.pid}`);
//                 winston.info('=========================================');
//                 res();
//             })
//             .on('error', (error) => {
//                 mongoose.disconnect();
//                 rej(error);
//             });
//             return server;
//         });
//     });
// }

// function closeServer() {
//   return mongoose.disconnect().then(() => (
//       new Promise((res, rej) => {
//           winston.info('Closing server.');
//           server.close((err) => {
//               if (err) {
//                   return rej(err);
//               }
//               return res();
//           });
//       })
//   ));
// }

// if (require.main === module) {
//   throng({
//       workers: WORKERS,
//       lifetime: Infinity,
//   }, () => {
//       runServer(DATABASE_URL).catch(err => winston.info(err));
//   });
// }

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}


// app.listen(process.env.PORT || 8080, () => {
//     console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
//   });
  

module.exports = { app, runServer, closeServer };