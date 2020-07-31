const axios = require('axios');

/**
 * A custom APIError
 * @param {String} message a message to store in error
 * @constructor
 */
function APIError(message, httpCode) {
    this.constructor.prototype.__proto__ = Error.prototype;
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.status = httpCode;
    this.message = message;
    
    try {
        axios.post('http://localhost:5000/api/error', { message, httpCode }).then((errorResponse) => {
            console.log(errorResponse.data);
        });
    } catch (error) {
        console.log('Error creating logs: ', error);
    }
}

module.exports = APIError;
