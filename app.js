const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const userRoute = require('./routes/user');
const mdb = require('./config/db');


// Initiate Mongo Server
mdb.InitiateMongoServer();
const app = express();
app.use(cors());

const store = mdb.createSessionStore();
// Catch errors
store.on('error', (error) => console.log(error));
app.use(require('express-session')({
    name: 'session.sid',
    secret: 'secure@123',
    cookie: {
        maxAge: 1000 * 60 * 60 * 2// 1 week
    },
    sameSite: true,
    store: store,
    resave: false,
    saveUninitialized: false,
    secure: process.env.NODE_ENV === 'production'
}));

app.use(bodyParser.json({ limit: '5mb' }));

// ROUTES with prefix
app.use('/session/user', userRoute);

// PORT
const PORT = process.env.PORT || 6000;

app.listen(PORT, (req, res) => {
    console.log(`Session Server Started at PORT ${PORT}`);
});

// error handler middleware
app.use((error, req, res) => {
    res.status(error.status || 500).send({
        name: error.name,
        status: error.status || 500,
        message: error.message || '@Internal Server Error'
    });
});

// rejection exceptions
process.on('unhandledRejection', (reason, p) => {
    console.error(reason, '@Unhandled Rejection at Promise', p);
});

// uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error(err, '@Uncaught Exception thrown');
    process.exit(1);
});
