const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Replace this with your MONGOURI.
const MONGOURI = 'mongodb://kiriti:12qwaszx@ds263640.mlab.com:63640/node-session';

module.exports = { 
    async InitiateMongoServer(){
        try {
            await mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log('Connected to DB !!');
        } catch (e) {
            console.log(e);
            throw e;
        }
    },

createSessionStore() {
    var store = new MongoDBStore({
        uri: MONGOURI,
        collection: 'Sessions'
    });
    return store;
}
 };
